/**
 * Tests for ScannerRegistry — central scanner lookup, dispatch, and aggregation.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  ScannerRegistry,
  createDefaultRegistry,
} from '../../src/scanners/registry.js';
import type {
  Scanner,
  ScanContext,
  ScanResult,
} from '../../src/scanners/types.js';

function fakeScanner(overrides: Partial<Scanner>): Scanner {
  const base: Scanner = {
    id: 'fake',
    name: 'Fake',
    description: 'fake scanner',
    category: 'compliance',
    scan: vi.fn().mockResolvedValue({
      scanner: overrides.id ?? 'fake',
      status: 'pass',
      violations: [],
      warnings: [],
      metrics: {},
      duration: 0,
      timestamp: new Date().toISOString(),
      summary: 'ok',
    } satisfies ScanResult),
  };
  return { ...base, ...overrides };
}

const ctx: ScanContext = {
  workspaceRoot: '/tmp',
  files: [],
};

describe('ScannerRegistry.register / get / all / ids', () => {
  it('registers a scanner and retrieves it by id', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a', name: 'A' }));
    expect(r.get('a')?.name).toBe('A');
  });

  it('throws when registering a duplicate id', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' }));
    expect(() => r.register(fakeScanner({ id: 'a' }))).toThrow(/already registered/);
  });

  it('all() returns every registered scanner', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' }));
    r.register(fakeScanner({ id: 'b' }));
    expect(r.all().map((s) => s.id).sort()).toEqual(['a', 'b']);
  });

  it('ids() returns the scanner-id list', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' }));
    r.register(fakeScanner({ id: 'b' }));
    expect(r.ids().sort()).toEqual(['a', 'b']);
  });

  it('get() returns undefined for an unknown id', () => {
    const r = new ScannerRegistry();
    expect(r.get('nope')).toBeUndefined();
  });
});

describe('ScannerRegistry.byCategory / forProject', () => {
  it('byCategory filters by the scanner.category field', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a', category: 'compliance' }));
    r.register(fakeScanner({ id: 'b', category: 'security' }));
    expect(r.byCategory('compliance').map((s) => s.id)).toEqual(['a']);
    expect(r.byCategory('security').map((s) => s.id)).toEqual(['b']);
  });

  it('forProject returns scanners with no projects field (universal)', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' })); // projects undefined
    expect(r.forProject('any').map((s) => s.id)).toEqual(['a']);
  });

  it('forProject filters scanners that opt into specific projects', () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a', projects: ['only-this'] }));
    r.register(fakeScanner({ id: 'b' }));
    expect(r.forProject('only-this').map((s) => s.id).sort()).toEqual(['a', 'b']);
    expect(r.forProject('other').map((s) => s.id)).toEqual(['b']);
  });
});

describe('ScannerRegistry.run', () => {
  it('throws on unknown scanner id with the available list', async () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' }));
    await expect(r.run('missing', ctx)).rejects.toThrow(/not found.*Available: a/);
  });

  it('dispatches to the scanner.scan() method', async () => {
    const r = new ScannerRegistry();
    const scanner = fakeScanner({ id: 'a' });
    r.register(scanner);
    await r.run('a', ctx);
    expect(scanner.scan).toHaveBeenCalledWith(ctx);
  });
});

describe('ScannerRegistry.runAll', () => {
  it('runs all registered scanners and returns their results', async () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a' }));
    r.register(fakeScanner({ id: 'b' }));
    const results = await r.runAll(ctx);
    expect(results.map((r) => r.scanner).sort()).toEqual(['a', 'b']);
  });

  it('captures a thrown scanner as an error result and continues', async () => {
    const r = new ScannerRegistry();
    r.register(
      fakeScanner({
        id: 'broken',
        scan: vi.fn().mockRejectedValue(new Error('boom')),
      }),
    );
    r.register(fakeScanner({ id: 'good' }));
    const results = await r.runAll(ctx);
    const broken = results.find((r) => r.scanner === 'broken');
    expect(broken?.status).toBe('error');
    expect(broken?.summary).toContain('boom');
    const good = results.find((r) => r.scanner === 'good');
    expect(good?.status).toBe('pass');
  });

  it('runAll narrows to forProject when context.project is set', async () => {
    const r = new ScannerRegistry();
    r.register(fakeScanner({ id: 'a', projects: ['only-this'] }));
    r.register(fakeScanner({ id: 'b' }));
    const results = await r.runAll({ ...ctx, project: 'other' });
    expect(results.map((r) => r.scanner)).toEqual(['b']);
  });
});

describe('createDefaultRegistry', () => {
  it('returns a registry pre-populated with the built-in scanners', async () => {
    const r = await createDefaultRegistry();
    const ids = r.ids();
    expect(ids).toContain('design-tokens');
    expect(ids).toContain('barrel-exports');
    expect(ids).toContain('pagelayout');
    expect(ids).toContain('license-headers');
    expect(ids).toContain('tlp-headers');
    expect(ids).toContain('test-data-guardian');
    expect(ids).toContain('code-smell');
    expect(ids).toContain('api-compliance');
    expect(ids.length).toBeGreaterThanOrEqual(11);
  });
});

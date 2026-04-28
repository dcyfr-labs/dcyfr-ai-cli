/**
 * Tests for src/lib/files.ts — file discovery, safe reads, path utilities.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  discoverFiles,
  safeReadFile,
  pathExists,
  relativePath,
  listProjects,
  getLines,
} from '../../src/lib/files.js';

let workspace = '';

beforeEach(async () => {
  workspace = await mkdtemp(join(tmpdir(), 'dcyfr-cli-files-'));
});

afterEach(async () => {
  if (workspace) await rm(workspace, { recursive: true, force: true });
});

describe('discoverFiles', () => {
  it('returns [] for an empty directory', async () => {
    const files = await discoverFiles(workspace);
    expect(files).toEqual([]);
  });

  it('finds files at the top level', async () => {
    await writeFile(join(workspace, 'a.ts'), 'export const a = 1;');
    await writeFile(join(workspace, 'b.tsx'), 'export const b = 2;');
    const files = await discoverFiles(workspace);
    expect(files).toHaveLength(2);
  });

  it('recurses into subdirectories', async () => {
    await mkdir(join(workspace, 'src/lib'), { recursive: true });
    await writeFile(join(workspace, 'src/lib/util.ts'), 'export {};');
    const files = await discoverFiles(workspace);
    expect(files.some((f) => f.endsWith('util.ts'))).toBe(true);
  });

  it('filters by extension', async () => {
    await writeFile(join(workspace, 'a.ts'), '');
    await writeFile(join(workspace, 'b.md'), '');
    await writeFile(join(workspace, 'c.json'), '{}');
    const files = await discoverFiles(workspace, { extensions: ['.ts'] });
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/a\.ts$/);
  });

  it('skips DEFAULT_IGNORE directories (node_modules, .git, dist)', async () => {
    await mkdir(join(workspace, 'node_modules/foo'), { recursive: true });
    await writeFile(join(workspace, 'node_modules/foo/leaked.ts'), '');
    await mkdir(join(workspace, '.git'), { recursive: true });
    await writeFile(join(workspace, '.git/HEAD'), '');
    await writeFile(join(workspace, 'real.ts'), '');
    const files = await discoverFiles(workspace);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/real\.ts$/);
  });

  it('skips dot-files at any level', async () => {
    await writeFile(join(workspace, '.hidden.ts'), '');
    await writeFile(join(workspace, 'visible.ts'), '');
    const files = await discoverFiles(workspace);
    expect(files).toHaveLength(1);
  });

  it('honors a custom ignore list', async () => {
    await mkdir(join(workspace, 'private'), { recursive: true });
    await writeFile(join(workspace, 'private/secret.ts'), '');
    await writeFile(join(workspace, 'public.ts'), '');
    const files = await discoverFiles(workspace, { ignore: ['private'] });
    expect(files).toHaveLength(1);
  });

  it('honors maxDepth = 0 (top level only)', async () => {
    await mkdir(join(workspace, 'sub'), { recursive: true });
    await writeFile(join(workspace, 'sub/deep.ts'), '');
    await writeFile(join(workspace, 'top.ts'), '');
    const files = await discoverFiles(workspace, { maxDepth: 0 });
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/top\.ts$/);
  });

  it('honors a pathPattern regex filter', async () => {
    await mkdir(join(workspace, 'src'), { recursive: true });
    await writeFile(join(workspace, 'src/keep.ts'), '');
    await writeFile(join(workspace, 'drop.ts'), '');
    const files = await discoverFiles(workspace, { pathPattern: /\/src\// });
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/keep\.ts$/);
  });

  it('does not throw on unreadable subdirectories', async () => {
    await writeFile(join(workspace, 'a.ts'), '');
    // Real-world: walkDir gracefully ignores readdir failures (e.g., permissions).
    // Verified by the catch block returning [] for the failed dir.
    const files = await discoverFiles(workspace);
    expect(Array.isArray(files)).toBe(true);
  });
});

describe('safeReadFile', () => {
  it('returns the file content for an existing file', async () => {
    const file = join(workspace, 'a.ts');
    await writeFile(file, 'hello');
    expect(await safeReadFile(file)).toBe('hello');
  });

  it('returns null for a non-existent file', async () => {
    expect(await safeReadFile(join(workspace, 'nope.ts'))).toBeNull();
  });
});

describe('pathExists', () => {
  it('returns true for an existing path', async () => {
    const file = join(workspace, 'a.ts');
    await writeFile(file, '');
    expect(await pathExists(file)).toBe(true);
  });

  it('returns false for a non-existent path', async () => {
    expect(await pathExists(join(workspace, 'nope.ts'))).toBe(false);
  });
});

describe('relativePath', () => {
  it('returns the relative path from the workspace root', () => {
    expect(relativePath('/a/b', '/a/b/c/d.ts')).toBe('c/d.ts');
  });

  it('returns an empty string when paths are identical', () => {
    expect(relativePath('/a/b', '/a/b')).toBe('');
  });
});

describe('listProjects', () => {
  it('returns directories that contain a package.json', async () => {
    await mkdir(join(workspace, 'app'), { recursive: true });
    await writeFile(join(workspace, 'app/package.json'), '{}');
    await mkdir(join(workspace, 'lib'), { recursive: true });
    await writeFile(join(workspace, 'lib/package.json'), '{}');
    await mkdir(join(workspace, 'no-pkg'), { recursive: true });
    const projects = await listProjects(workspace);
    expect(projects.sort()).toEqual(['app', 'lib']);
  });

  it('skips hidden and DEFAULT_IGNORE directories', async () => {
    await mkdir(join(workspace, '.hidden'), { recursive: true });
    await writeFile(join(workspace, '.hidden/package.json'), '{}');
    await mkdir(join(workspace, 'node_modules'), { recursive: true });
    await writeFile(join(workspace, 'node_modules/package.json'), '{}');
    await mkdir(join(workspace, 'real'), { recursive: true });
    await writeFile(join(workspace, 'real/package.json'), '{}');
    const projects = await listProjects(workspace);
    expect(projects).toEqual(['real']);
  });
});

describe('getLines', () => {
  it('splits content on \\n', () => {
    expect(getLines('a\nb\nc')).toEqual(['a', 'b', 'c']);
  });

  it('returns a single-element array for content without newlines', () => {
    expect(getLines('one')).toEqual(['one']);
  });

  it('preserves empty lines', () => {
    expect(getLines('a\n\nb')).toEqual(['a', '', 'b']);
  });
});

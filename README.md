# @dcyfr/ai-cli

<!-- README-META
  tlp_clearance: GREEN
  status: active
  name: dcyfr-ai-cli
  description: DCYFR AI Command-Line Interface - Portable CLI tool for DCYFR AI harness
  last_validated: 2026-07-11
-->

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/dcyfr-labs/dcyfr-ai-cli)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sponsor](https://img.shields.io/badge/sponsor-30363D?style=flat-square&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/dcyfr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@dcyfr/ai-cli?style=flat-square&logo=npm)](https://www.npmjs.com/package/@dcyfr/ai-cli)

**A portable, cross-platform command-line interface for DCYFR AI harness - supported on Windows, macOS, and Linux.**

This is a standalone CLI tool extracted from the dcyfr-ai-nodejs starter template, designed to be lightweight, portable, and easy to use across all operating systems.

## About DCYFR

`@dcyfr/ai-cli` is maintained by **DCYFR Labs** as part of the DCYFR AI tooling portfolio.

- **DCYFR** is a trademark of DCYFR Labs.
- Primary domain: [www.dcyfr.ai](https://www.dcyfr.ai)
- Licensing details: [LICENSE](./LICENSE)

---

## ⚡ 30-Second Quick Start

```bash
# Install globally
npm install -g @dcyfr/ai-cli

# Run immediately
dcyfr --help
dcyfr init my-project
# ✅ DCYFR CLI ready to use
```

---

## 🧭 Related Packages

| Package                                                           | Purpose                | Type        |
| ------------------------------------------------------------------ | ---------------------- | ----------- |
| [@dcyfr/ai](https://github.com/dcyfr-labs/dcyfr-ai)                 | Core AI harness        | npm package |
| [@dcyfr/ai-nodejs](https://github.com/dcyfr-labs/dcyfr-ai-nodejs)   | Node.js starter        | Template    |
| [@dcyfr/ai-api](https://github.com/dcyfr-labs/dcyfr-ai-api)         | REST API template      | Template    |
| [dcyfr-labs](https://github.com/dcyfr-labs/dcyfr-labs)              | Production Next.js app | Application |

> This package declares an **optional peer dependency** on [`@dcyfr/ai`](https://github.com/dcyfr-labs/dcyfr-ai) (`^3.0.1`).

---

## ✨ Features

- 🖥️ **Cross-Platform** - Works seamlessly on Windows, macOS, and Linux
- 🚀 **Portable** - Single binary/package installation
- 🤖 **DCYFR AI Integration** - Full harness support with validation and telemetry
- 📘 **TypeScript Strict Mode** - Full type safety with strict compiler options
- ⚡ **Modern Node.js** - ESM modules, Node.js 20+
- 🔧 **Developer Experience** - Hot reload, source maps, path aliases
- 📊 **Structured Logging** - JSON-based logging with multiple levels
- ✅ **Code Quality** - ESLint, Prettier, strict validation

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0

### Installation

#### npm (Global)

```bash
npm install -g @dcyfr/ai-cli
dcyfr --help
```

#### npm (Project)

```bash
npm install @dcyfr/ai-cli
npx dcyfr --help
```

#### Manual from Source

```bash
git clone https://github.com/dcyfr-labs/dcyfr-ai-cli.git
cd dcyfr-ai-cli
npm install
npm run build
npm link  # Install globally (optional)
dcyfr --help
```

### Platform-Specific Notes

#### Windows

```powershell
# Global installation (PowerShell as Administrator)
npm install -g @dcyfr/ai-cli

# Or use in your project
npm install @dcyfr/ai-cli
npx dcyfr status
```

#### macOS

```bash
# Global installation
npm install -g @dcyfr/ai-cli

# Or use in your project
npm install @dcyfr/ai-cli
npx dcyfr status
```

#### Linux

```bash
# Global installation
npm install -g @dcyfr/ai-cli

# Or use in your project
npm install @dcyfr/ai-cli
npx dcyfr status
```

## 📖 Usage

### Available Commands

```bash
dcyfr status      # Show DCYFR AI harness / workspace status
dcyfr validate    # Run validation checks (compliance, security, governance)
dcyfr telemetry   # Show telemetry configuration
dcyfr init        # Initialize DCYFR AI CLI configuration
dcyfr scan        # Run workspace scanners
dcyfr health      # Show workspace health dashboard
dcyfr fix         # Auto-fix violations detected by scanners
dcyfr daemon      # Manage the workspace guardian daemon
dcyfr ai          # Manage AI provider configuration
dcyfr config      # Manage DCYFR configuration
dcyfr --help      # Show all commands
dcyfr --version   # Show version
```

Full per-command flags, subcommands, and examples: **[docs/COMMAND_REFERENCE.md](./docs/COMMAND_REFERENCE.md)**.

### Examples

Standardized example index: [examples/README.md](./examples/README.md)

#### Check Framework Status

```bash
$ dcyfr status

🚀 DCYFR AI Harness Status

Validation: ✅ Enabled
Telemetry:  ✅ Enabled

Node Version: v22.10.0
Platform:     darwin (arm64)
Memory:       45MB / 256MB
```

#### Run Validation Checks

```bash
$ dcyfr validate

🔍 Running Validation Checks

Mode: Enabled
Parallel: Yes

✅ Validation framework initialized
✅ Configuration loaded
✅ System checks passed
```

#### Show Telemetry Info

```bash
$ dcyfr telemetry

📊 Telemetry Configuration

Status:  ✅ Enabled
Storage: file
Path:    .dcyfr/telemetry
```

## 📚 Library Mode Usage

You can also use `@dcyfr/ai-cli` as a library in your Node.js/TypeScript applications.

### TypeScript

```typescript
import { runCLI, type CLIResult, type CLIOptions } from '@dcyfr/ai-cli';

// Run CLI with custom arguments
const result: CLIResult = await runCLI(['status'], {
  throw: false, // Return errors as values instead of throwing
});

console.log('Exit code:', result.exitCode);
console.log('Output:', result.stdout);
console.log('Errors:', result.stderr);

// With error throwing enabled
try {
  const result = await runCLI(['validate'], { throw: true });
  console.log('Validation passed!');
} catch (error) {
  console.error('Validation failed:', error);
}
```

### JavaScript (ESM)

```javascript
import { runCLI } from '@dcyfr/ai-cli';

const result = await runCLI(['--version']);
console.log(result.stdout); // e.g. "1.0.5"
```

### JavaScript (CommonJS)

```javascript
const { runCLI } = require('@dcyfr/ai-cli');

(async () => {
  const result = await runCLI(['status']);
  if (result.exitCode === 0) {
    console.log('Success:', result.stdout);
  } else {
    console.error('Error:', result.stderr);
  }
})();
```

### API Reference

#### `runCLI(args, options)`

Execute CLI commands programmatically.

**Parameters:**

- `args: string[]` - Command line arguments (defaults to `process.argv.slice(2)`)
- `options?: CLIOptions` - Optional configuration

**Returns:** `Promise<CLIResult>`

**CLIOptions:**

```typescript
interface CLIOptions {
  throw?: boolean; // If true, throw errors instead of returning them (default: false)
}
```

**CLIResult:**

```typescript
interface CLIResult {
  exitCode: number; // 0 for success, non-zero for error
  stdout: string; // Standard output captured during execution
  stderr: string; // Standard error captured during execution
}
```

## ⚙️ Configuration

The CLI looks for configuration in the following order (first found is used):

1. `.dcyfr.json` in current directory
2. `config.json` in current directory
3. `config.json` in config directory:
   - **Windows**: `%APPDATA%\.dcyfr\`
   - **macOS/Linux**: `~/.dcyfr/`

A starter config is provided at [`.dcyfr.json.example`](./.dcyfr.json.example).

### Environment Variables

All are optional; they configure the `dcyfr ai` provider-management command (`src/ai/provider.ts`):

| Variable             | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `ANTHROPIC_API_KEY`  | Anthropic provider credential                |
| `GITHUB_TOKEN`       | GitHub Models provider credential            |
| `OPENAI_BASE_URL`    | OpenAI-compatible endpoint override          |
| `LOCAL_LLM_BASE_URL` | Local LLM endpoint (e.g., Ollama)            |
| `LOCAL_LLM_MODEL`    | Local LLM model name                         |
| `WORKBENCH_BASE_URL` | Remote workbench inference endpoint          |

On Windows, `APPDATA` is also read to resolve the config directory.

### Example Configuration

```json
{
  "telemetry": {
    "enabled": true,
    "level": "info",
    "endpoints": [
      {
        "type": "console",
        "level": "info"
      }
    ]
  },
  "validation": {
    "enabled": true,
    "strict": true
  },
  "cli": {
    "verboseLogging": false,
    "colorOutput": true
  }
}
```

## 🔧 Development

### Build from Source

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run build:watch

# Development
npm run dev
```

### Testing & Linting

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Lint
npm run lint
npm run lint:fix

# Format code
npm run format
```

## 🗂️ Project Structure

```
bin/
└── cli.js              # npm bin wrapper → dist/cli.js
src/
├── cli.ts              # Main CLI entry point (commander program + runCLI)
├── index.ts            # Library-mode exports
├── commands/           # Command implementations (one file per command)
│   ├── status.ts       ├── validate.ts     ├── telemetry.ts
│   ├── init.ts         ├── scan.ts         ├── health.ts
│   ├── daemon.ts       ├── fix.ts          ├── ai.ts
│   └── config.ts
├── ai/                 # AI provider management (providers, routing)
├── config/             # Configuration schema and management
├── daemon/             # Workspace guardian daemon internals
├── fix/                # Auto-fix engine
├── health/             # Health dashboard / scoring
├── scanners/           # Workspace scanners
└── lib/                # Shared utilities
    ├── config.ts       # Configuration loading (cross-platform)
    ├── files.ts        ├── git.ts          ├── logger.ts
    ├── mode.ts         ├── types.ts        └── workspace.ts
```

## 🔄 Cross-Platform Compatibility

This CLI is specifically designed for cross-platform support:

- **Path Handling**: Uses Node.js `path` module for proper OS path handling
- **Home Directory**: Uses `os.homedir()` for platform-specific home directory resolution
- **Config Locations**: Different config directories for Windows, macOS, and Linux
- **Executable Wrapper**: Proper shebang (`#!/usr/bin/env node`) for Unix-like systems and npm bin wrapper for Windows
- **Environment Variables**: Respects platform-specific env vars (e.g., `APPDATA` on Windows)

## 📚 Documentation

- [docs/COMMAND_REFERENCE.md](./docs/COMMAND_REFERENCE.md) - Full command reference (flags, subcommands, architecture, health scoring)
- [AGENTS.md](./AGENTS.md) - AI agent guidance and patterns
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [LICENSE](./LICENSE) - MIT License

## 🐛 Troubleshooting

### Command not found on macOS/Linux

If `dcyfr` is not found after global installation:

```bash
# Check npm global path
npm config get prefix

# Add to PATH if needed
export PATH="$(npm config get prefix)/bin:$PATH"

# Add to ~/.bashrc or ~/.zshrc permanently:
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
```

### PowerShell execution policy on Windows

If you get execution policy errors on Windows PowerShell:

```powershell
# Use cmd or npm scripts instead
npm install @dcyfr/ai-cli
npx dcyfr status

# Or set execution policy (use with caution)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Configuration not found

Check configuration paths:

```bash
# Windows
echo %APPDATA%

# macOS/Linux
echo ~

# Then verify config file exists in: ~/.dcyfr/config.json
# Or in current directory: .dcyfr.json
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT - See [LICENSE](./LICENSE) for details.

## 🔗 Related

- [DCYFR AI Harness](https://github.com/dcyfr-labs/dcyfr-ai)
- [Node.js Starter Template](https://github.com/dcyfr-labs/dcyfr-ai-nodejs)
- [DCYFR Labs](https://github.com/dcyfr-labs/dcyfr-labs)

---

Built with ❤️ by [DCYFR](https://www.dcyfr.ai)

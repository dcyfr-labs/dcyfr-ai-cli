# @dcyfr/ai-cli Examples

This directory documents practical CLI invocation examples.

## Prerequisites

- Node.js `>=20`
- From `dcyfr-ai-cli/`: `npm install`

## Example Commands

| Scenario                   | Command                     |
| -------------------------- | --------------------------- |
| Show runtime status        | `npm run example:status`    |
| Show initialization help   | `npm run example:init`      |
| Inspect telemetry settings | `npm run example:telemetry` |

## Validation Commands

- Compile/type-check baseline: `npm run examples:compile`
- Run example command set: `npm run examples:check`
- Full validation: `npm run examples:test`

## Expected Output

Commands should print a command header and a successful status block from the CLI.

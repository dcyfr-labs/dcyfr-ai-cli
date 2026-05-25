---
'@dcyfr/ai-cli': patch
---

fix(lib/files): normalize path separators to POSIX in `relativePath` and `pathPattern` matching so scanner output, AI context, and forward-slash regexes (`/\/src\//`, `/\/api\//`, `/\/docs\//`) behave identically on Windows, macOS, and Linux. Fixes two pre-existing Windows-only test failures in `tests/lib/files.test.ts` that were masked by `continue-on-error` on non-Linux runners.

# Implementation Evidence: Tasks 21-31

Updated: 2026-07-28

## Validation Commands

- Backend: not executed for this batch (no backend changes made for tasks 21-31 in this update).
- Frontend build: `cd VMManager-web/angular && npm run build` - fail.

## Frontend Implementation

Added standalone Angular placeholder components and wired them into the app shell:

- `create-connection`
- `connection-auth`
- `host-details`
- `preferences`
- `about`
- `async-job`
- `console`
- `xml-editor`
- `os-list`
- `snapshots`
- `snapshot-new`

App-shell integration was added in:

- `VMManager-web/angular/src/app/app.ts` (imports + `imports: []` registration)
- `VMManager-web/angular/src/app/app.html` (component selectors under manager page)

## Current Verification Limitation

Frontend build currently fails due to existing Angular template issues outside tasks 21-31 (missing `track` expressions in several `@for` loops in older storage-related components). Therefore verification remains partial and all tasks stay `in-progress`.

## Integration-Test Parity

No matched Python UI integration baseline + Angular integration/e2e mapping exists yet for tasks 21-31. TDD UI Integration Test Progress remains 0% for all tasks in this set.

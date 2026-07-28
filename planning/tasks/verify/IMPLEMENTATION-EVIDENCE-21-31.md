# Implementation Evidence: Tasks 21-31

Updated: 2026-07-28

## Validation Commands

- Backend: not re-run in this batch (frontend-focused implementation).
- Frontend build: `cd VMManager-web/angular && npm run build` - pass.

## Frontend Implementation (Functional)

Implemented dedicated component logic with supporting `models` and `api service` files:

- `create-connection`: create/list connections through manager endpoints.
- `connection-auth`: form flow with validation and response states.
- `host-details`: connection-scoped host metrics via `/api/manager/host/{connectionId}`.
- `preferences`: load preferences via `/api/manager/preferences`.
- `about`: load about metadata via `/api/manager/about`.
- `async-job`: interactive start/cancel progress flow.
- `console`: VM selection + VM window actions via vm-window API.
- `xml-editor`: VM XML editor launch/apply path via vm-details API.
- `os-list`: VM OS list launch/apply path via vm-details API.
- `snapshots`: snapshot list/create/delete/revert state flow.
- `snapshot-new`: event-driven snapshot creation panel.

## App-Shell Integration

- `VMManager-web/angular/src/app/app.ts` (imports + `imports: []` registration)
- `VMManager-web/angular/src/app/app.html` (component selectors under manager page)

## Verification Notes

- Angular build blockers from template `@for` loops were fixed in storage-related components.
- Frontend compiles successfully after adding functional behavior for tasks 21-31.
- Tasks remain `in-progress` because integration-test parity (Python UI baseline <-> Angular integration/e2e mapping) is still missing.

## Integration-Test Parity

No matched Python UI integration baseline + Angular integration/e2e mapping exists yet for tasks 21-31. TDD UI Integration Test Progress remains 0% for all tasks in this set.

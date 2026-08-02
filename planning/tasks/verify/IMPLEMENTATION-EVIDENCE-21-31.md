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

## Angular Playwright web evidence (not reference verification)

Updated: 2026-08-01

Command (from `testing/playwright`, `NODE_OPTIONS` cleared):

```bash
npx playwright test tests/tools.spec.mjs --reporter=list
```

Result: **6 passed**.

| Task | Component | Web evidence in `tests/tools.spec.mjs` |
| --- | --- | --- |
| 21 | create-connection | refresh, add connection, known-connections list status |
| 22 | connection-auth | validation error, remember/session authenticate success |
| 23 | host-details | refresh connections, load details (URI/CPU/memory/VM count) |
| 24 | preferences | refresh + Preferences loaded + theme/URI/auto-connect |
| 25 | about | refresh + About data loaded + name/module/version |
| 26 | async-job | start, progress, cancel, complete to 100% |
| 27 | console | refresh VMs, open, status, run, pause |
| 28 | xml-editor | open editor, apply XML |
| 29 | os-list | open list, apply OS |
| 30 | snapshots | refresh, list, revert, delete |
| 31 | snapshot-new | required-name error, create emit into snapshots |

Notes:
- Verify / Fully Verified / TDD remain **0%** until Python virt-manager reference Playwright exists.
- Angular PW is web implementation evidence only.
- `VMManager-web/bin/` is IDE compile junk; never commit; delete if it reappears.


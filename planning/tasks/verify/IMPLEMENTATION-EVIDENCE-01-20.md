# Implementation Evidence: Tasks 01-20

Updated: 2026-07-27

## Validation Commands

- Backend: `cd VMManager-web && ./mvnw -q test` - pass.
- Frontend build: `cd VMManager-web/angular && npm run build` - pass.
- Frontend tests: `cd VMManager-web/angular && npm test -- --watch=false --browsers=ChromeHeadless` - pass (3 tests).

## Implementation and Reachability

| Tasks | Backend module | Angular module / entry point | Current parity limitation |
| --- | --- | --- | --- |
| 01-05 | `manager`, `vmwindow`, `vmdetails`, `createvm`, `clonevm` | Existing Manager, VM Window, VM Details, Create VM, and Clone VM pages | Advanced original behavior and matched integration tests absent. |
| 06-07 | `deletevm`, `migratevm` | Delete dialog and manager-row Migrate action | Original async jobs, per-resource choices, and validation are simplified. |
| 08-10 | `addhardware`, `addstorage`, `filesystemdetails` | VM Details actions open dedicated dialogs | Device/storage browser behavior is reduced. |
| 11-13 | `graphicsdetails`, `tpmdetails`, `vsockdetails` | VM Details actions open dedicated editors | Original device capability validation is not present. |
| 14-15 | `createnetwork`, `networklist` | Create Network navigation page and VM Details network selector | Network creation/source selection is in-memory and simplified. |
| 16 | `hostnets` | Host Networks navigation page | Real libvirt state and async lifecycle jobs are not present. |
| 17-20 | `storage` | Storage navigation page | Volume/pool operations are in-memory; storage browse is path-oriented, not a navigable filesystem tree. |

## Integration-Test Parity

No task currently has the required matched Python UI integration test, Angular integration/e2e test, or mapping table. Therefore all Tasks 01-20 remain below 100% Verification and cannot be marked `done`.
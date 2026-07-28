# Task 37 - console

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/details/console.py, virtManager/details/viewers.py, virtManager/details/serialcon.py, virtManager/details/sshtunnels.py
- Flow Classes: vmmConsolePages -> _ConsoleMenu -> vmmOverlayToolbar -> _TimedRevealer
- Actions: open console, close console, switch viewer, connect viewer, grab keyboard, resize console, toggle fullscreen, send key combos.
- Action Flows:
  - open console: VM open/window action -> console backend endpoint -> current viewer state
  - connect viewer: graphics/serial selection -> viewer connect path -> console session state
  - grab keyboard: fullscreen toolbar -> keyboard grab logic -> viewer update
  - toggle fullscreen: view toggle -> toolbar state -> window state transition
- Scope: Java backend state and operations for VM console/viewer actions behind the VM window flows.

## Evidence

### Backend Evidence

- Files changed: <controller/service/dto/test files>
- Command: <backend test/build command>
- Result: <pass/fail + key output>

### Frontend Evidence

- Files changed: <component/service/model/template/style files>
- Command: <frontend build/test command>
- Result: <pass/fail + key output>

### Integration Evidence

- Entry point: <how this flow is reached in app shell>
- Executed actions: <which actions were exercised>
- Result: <pass/fail + notes>

### Parity Evidence

- Covered original flows: <list>
- Known deviations: <none or explicit differences>

## Integration Test Evidence

### Python UI Integration Baseline

- Test file(s): <python integration test paths>
- Cases: <case names>
- Result: <pass/fail>

### Angular Integration or E2E Match

- Test file(s): <angular integration/e2e test paths>
- Cases: <case names>
- Result: <pass/fail>

### Mapping Table

| Python test case | Angular test case | Status |
| --- | --- | --- |
| <python_case_1> | <angular_case_1> | <pass/fail> |

### Notes

- Approved behavior differences: <none or documented deviations>

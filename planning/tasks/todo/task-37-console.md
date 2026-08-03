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

## Concrete Sprint Tasks

- [ ] Keep existing vm-window open/status/pause/start endpoints behavior unchanged.
- [ ] Add console endpoints: connect-viewer, fullscreen toggle, and send-keys.
- [ ] Extend vm-window response DTO with optional console fields and preserve compatibility.
- [ ] Map `VIEWER_UNAVAILABLE`, `CONSOLE_DISCONNECTED`, and `VM_NOT_RUNNING` to stable error payload.
- [ ] Wire Angular console component to new console endpoints and render updated status message.
- [ ] Add backend tests for each console endpoint plus unsupported-viewer error path.
- [ ] Add frontend tests for connect-viewer/fullscreen/send-keys flow state updates.

### Validation Gate Commands

```bash
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q test
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/testing/playwright && env -u NODE_OPTIONS -u VSCODE_INSPECTOR_OPTIONS npx playwright test tests/machines.spec.mjs tests/tools.spec.mjs --reporter=list
```

## Frontend Contract

### Angular Integration Points

- console component currently uses vm-window endpoints for open/status/pause/run
- console UI state derives from vm-window view DTO

### Endpoint Contract

- POST /api/vm-window/{vmId}/open
- POST /api/vm-window/{vmId}/status
- POST /api/vm-window/{vmId}/pause
- POST /api/vm-window/{vmId}/start
- POST /api/vm-window/{vmId}/console/connect-viewer
  - request: { viewer: "graphics" | "serial" }
- POST /api/vm-window/{vmId}/console/fullscreen
  - request: { enabled: boolean }
- POST /api/vm-window/{vmId}/console/send-keys
  - request: { combo: string }

### Example Payloads

- POST /api/vm-window/7/open response

```json
{
  "vmId": 7,
  "vmName": "fedora-test",
  "status": "RUNNING",
  "statusMessage": "Console opened.",
  "consoleConnected": true,
  "viewerType": "graphics",
  "fullscreen": false,
  "keyboardGrabbed": false
}
```

- POST /api/vm-window/7/console/connect-viewer request

```json
{
  "viewer": "serial"
}
```

- POST /api/vm-window/7/console/fullscreen request

```json
{
  "enabled": true
}
```

- POST /api/vm-window/7/console/send-keys request

```json
{
  "combo": "Ctrl+Alt+Del"
}
```

### Java DTO Mapping

- VM window state response: VmWindowViewDto
- Console connect viewer request: ConsoleConnectViewerRequestDto
- Console fullscreen request: ConsoleFullscreenRequestDto
- Console send keys request: ConsoleSendKeysRequestDto

### Response Contract

- Extend vm-window view DTO with optional console fields:
  - consoleConnected, viewerType, fullscreen, keyboardGrabbed

### Error Mapping

- VIEWER_UNAVAILABLE -> console viewer error
- CONSOLE_DISCONNECTED -> reconnect prompt
- VM_NOT_RUNNING -> start VM suggestion

### UI Impact Checklist

- [ ] Existing console open/status/pause/run calls remain unchanged
- [ ] New console actions are additive and backward-compatible
- [ ] Console-specific errors map to clear frontend status messages

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

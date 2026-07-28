# Task 35 - create-connection-auth

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, virtManager/lib/connectauth.py
- Flow Classes: vmmCreateConn -> _vmmConnectAuth
- Actions: open connection dialog, build libvirt URI, authenticate credentials, remember connection, reject invalid host input.
- Action Flows:
  - open connection dialog: File->Add Connection -> backend open endpoint -> create connection UI state
  - build libvirt URI: hypervisor/remote controls -> URI synthesis -> connection request payload
  - authenticate credentials: auth prompt -> libvirt openAuth path -> credential exchange
  - remember connection: auth failure recovery -> remember choice -> persisted connection behavior
- Scope: Real backend endpoints and service logic for creating and authenticating libvirt connections.

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

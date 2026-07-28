# Task 36 - host-details

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/host.py, virtManager/hostnets.py, virtManager/hoststorage.py
- Flow Classes: vmmHost -> vmmConnectionManager -> vmmHostNets -> vmmHostStorage
- Actions: load host details, sample host metrics, update autoconnect, open host subpanes, react to connection state changes.
- Action Flows:
  - load host details: host details endpoint -> metrics DTO -> host view update
  - sample host metrics: libvirt host data -> backend metrics service -> current host state
  - update autoconnect: host config toggle -> persisted connection setting -> refresh
  - open host subpanes: host details page -> networks/storage panes -> nested module entry
- Scope: Java backend support for host-level details and connection-scoped metrics/actions.

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

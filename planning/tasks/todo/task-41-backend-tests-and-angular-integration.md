# Task 41 - backend-tests-and-angular-integration

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, virtManager/host.py, virtManager/details/console.py, virtManager/xmleditor.py, virtManager/oslist.py, virtManager/details/snapshots.py
- Flow Classes: vmmCreateConn -> vmmHost -> vmmConsolePages -> vmmXMLEditor -> vmmOSList -> vmmSnapshotPage
- Actions: build backend tests, add API behavior tests, define Angular parity tests, record mapping table.
- Action Flows:
  - backend tests: Java service/controller implementation -> unit/integration tests -> pass/fail evidence
  - Angular parity tests: endpoint wiring -> component/service tests -> flow mapping table
  - mapping table: Python flow case -> Angular test case -> documented result
- Scope: Verification ticket for proving the Java libvirt backend and Angular wiring behave like the original virt-manager flows.

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

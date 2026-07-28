# Task 39 - snapshots-async-job

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/asyncjob.py, virtManager/details/snapshots.py, virtManager/details/snapshots.py
- Flow Classes: vmmAsyncJob -> vmmSnapshotPage -> vmmSnapshotNew
- Actions: async progress, cancel job, create snapshot, delete snapshot, revert snapshot, screenshot capture.
- Action Flows:
  - async progress: long-running libvirt call -> progress meter -> finish callback
  - create snapshot: snapshot new wizard -> async job wrapper -> libvirt snapshot create
  - delete/revert snapshot: snapshot page action -> backend operation -> refresh snapshot list
- Scope: Java async job handling for snapshot operations and snapshot lifecycle endpoints.

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

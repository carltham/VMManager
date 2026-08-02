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

## Concrete Sprint Tasks

- [ ] Execute UI/API verification in mock mode only for this phase (no real OS/libvirt side effects required).
- [ ] Define endpoint family test matrix with at least one happy path and one failure path per family.
- [ ] Add backend integration tests for manager, vm-window, vm-details, connection-auth, snapshots, and jobs.
- [ ] Add or update Angular integration/e2e tests for mapped equivalent flows.
- [ ] Build mapping table: Python test case -> Angular test case -> pass/fail result.
- [ ] Record parity deviations and explicit approvals for each accepted difference.
- [ ] Update evidence blocks in tasks 33-40 with final test outputs and links.
- [ ] Enforce done criteria only when conversion, verification, and verify fields reach 100 by evidence.

### Final Verification Commands

```bash
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q test
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm test -- --watch=false --browsers=ChromeHeadless
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/testing/playwright && env -u NODE_OPTIONS -u VSCODE_INSPECTOR_OPTIONS npx playwright test --reporter=list
```

### Verification Mode

- Mock-only verification is accepted for this stage.
- Do not require real OS/libvirt execution paths for task completion in this phase.
- Record clearly in evidence that Playwright validates app + backend mock behavior, not host OS operations.

## Frontend Contract

### Angular Integration Points

- Verify all frontend backend consumers from tasks 21-31 are covered:
  - create-connection, connection-auth, host-details, console, xml-editor, os-list, snapshots, async-job, about, preferences

### Required Integration Assertions

- Endpoint compatibility:
  - existing manager/vm-window/vm-details calls remain green
  - new connection-auth/snapshots/jobs calls are green
- DTO compatibility:
  - Angular models deserialize without adapter hacks
- Error compatibility:
  - backend error codes map to deterministic UI messages/states

### Minimum Test Matrix Requirements

- At least one happy-path and one failure-path test per endpoint family:
  - manager, vm-window, vm-details, connection-auth, snapshots, jobs
- At least one parity case for each original flow cluster:
  - connection/auth, host details, console, xml/os list, snapshots/async

### Example Payloads

- Backend integration test assertion sample

```json
{
  "testId": "IT-SNAP-REVERT-001",
  "endpoint": "POST /api/snapshots/{vmId}/{snapshotId}/revert",
  "expectedStatus": 202,
  "expectedBody": {
    "accepted": true,
    "jobId": "<non-empty>"
  }
}
```

- Angular parity case mapping sample

```json
{
  "pythonCase": "test_snapshot_revert_refresh",
  "angularCase": "snapshots.component.spec.ts::revertSelected_refreshes_list",
  "status": "pass",
  "notes": "UI list updates after job completion poll."
}
```

### Java DTO Mapping

- Test assertion payload: IntegrationTestAssertionDto
- Parity mapping row: ParityMappingRowDto
- Endpoint verification summary: EndpointVerificationSummaryDto
- Error mapping verification row: ErrorMappingVerificationDto

### UI Impact Checklist

- [ ] Mapping table contains real test IDs/names, not placeholders
- [ ] Documented deviations are explicit and approved
- [ ] Evidence includes backend command output and frontend test/build output

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

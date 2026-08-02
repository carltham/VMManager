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

## Concrete Sprint Tasks

- [ ] Implement snapshot endpoints: list, create, delete, and revert with async job acceptance responses.
- [ ] Implement jobs endpoints: GET status and POST cancel with stable state model.
- [ ] Replace in-memory Angular snapshots API with HttpClient calls to `/api/snapshots/*`.
- [ ] Replace timer-based Angular async-job simulation with polling `/api/jobs/{jobId}`.
- [ ] Ensure snapshot list refreshes automatically on create/delete/revert job completion.
- [ ] Add backend tests for accepted job responses, running/completed/canceled states, and failure mapping.
- [ ] Add frontend tests for polling loop, cancel flow, and snapshot refresh behavior.

### Validation Gate Commands

```bash
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q test
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/testing/playwright && env -u NODE_OPTIONS -u VSCODE_INSPECTOR_OPTIONS npx playwright test tests/tools.spec.mjs tests/network-storage.spec.mjs --reporter=list
```

## Frontend Contract

### Angular Integration Points

- snapshots API is currently in-memory simulated and must be migrated to HTTP endpoints
- async-job API is currently interval-based simulated and must be migrated to job endpoints

### Endpoint Contract

- GET /api/snapshots/{vmId}
  - response: { items: [{ id, name, createdAt }] }
- POST /api/snapshots/{vmId}
  - request: { name: string }
  - response: { jobId: string, accepted: boolean }
- DELETE /api/snapshots/{vmId}/{snapshotId}
  - response: { jobId: string, accepted: boolean }
- POST /api/snapshots/{vmId}/{snapshotId}/revert
  - response: { jobId: string, accepted: boolean }
- GET /api/jobs/{jobId}
  - response: { jobId, state, progress, message?, errorCode? }
- POST /api/jobs/{jobId}/cancel
  - response: { jobId, state, message }

### Example Payloads

- GET /api/snapshots/7 response

```json
{
  "items": [
    { "id": 11, "name": "before-update", "createdAt": "2026-07-29T08:15:00Z" },
    { "id": 8, "name": "clean-state", "createdAt": "2026-07-28T17:02:00Z" }
  ]
}
```

- POST /api/snapshots/7 request

```json
{
  "name": "pre-upgrade"
}
```

- POST /api/snapshots/7 response

```json
{
  "jobId": "job_7f82c9",
  "accepted": true
}
```

- GET /api/jobs/job_7f82c9 response

```json
{
  "jobId": "job_7f82c9",
  "state": "RUNNING",
  "progress": 65,
  "message": "Creating snapshot..."
}
```

- POST /api/jobs/job_7f82c9/cancel response

```json
{
  "jobId": "job_7f82c9",
  "state": "CANCELED",
  "message": "Job canceled by user."
}
```

### Java DTO Mapping

- Snapshot list response: SnapshotListResponseDto
- Snapshot item: SnapshotItemDto
- Snapshot create request: SnapshotCreateRequestDto
- Job accepted response: JobAcceptedResponseDto
- Job status response: JobStatusResponseDto
- Job cancel response: JobCancelResponseDto

### Error Mapping

- SNAPSHOT_NAME_REQUIRED -> snapshot-new validation message
- SNAPSHOT_CONFLICT -> snapshots action conflict message
- JOB_FAILED -> async-job error state
- JOB_CANCELED -> async-job canceled state

### UI Impact Checklist

- [ ] Replace in-memory snapshot store with backend HTTP calls
- [ ] Replace timer-based async progress with /api/jobs polling
- [ ] Keep snapshot list refresh behavior after create/delete/revert completion

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

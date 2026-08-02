# Task 32 - libvirt-boundary

- Status: done (boundary matrix documented; no live libvirt yet)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, virtManager/lib/connectauth.py, virtManager/host.py, virtManager/details/console.py, virtManager/xmleditor.py, virtManager/oslist.py, virtManager/details/snapshots.py
- Flow Classes: vmmCreateConn -> _vmmConnectAuth -> vmmHost -> vmmConsolePages -> vmmXMLEditor -> vmmOSList -> vmmSnapshotPage
- Actions: define backend boundary, identify libvirt-touching calls, separate metadata-only flows.
- Action Flows:
  - define backend boundary: plan item review -> Spring service/controller mapping -> libvirt integration split
  - identify libvirt-touching calls: original Python flow audit -> backend scope list -> implementation backlog
  - separate metadata-only flows: about/preferences review -> non-libvirt endpoint classification -> ticket split
- Scope: Audit and classify which original flows require real libvirt integration versus metadata/config handling.
- Deliverable completed: boundary matrix + owner mapping + error-source mapping in planning/JAVA-LIBVIRT-BACKEND-PLAN.md
- Note: classification only; live libvirt is Tasks 34+.

## Frontend Contract

### Angular Integration Points

- create-connection + connection-auth: URI build, auth prompts, credential handling
- host-details: host summary/metrics panel
- console: open/status/controls
- xml-editor + os-list: launch/apply/selection flows
- snapshots + async-job: lifecycle actions and progress tracking
- about + preferences: metadata/config views

### Contract Deliverables (Non-runtime)

- Produce a boundary matrix documenting each UI action as one of:
  - libvirt-backed operation
  - metadata/config-only operation
  - hybrid operation (libvirt + app state)
- Produce owner mapping: controller, service, integration-layer class per action.
- Produce error-source mapping: user validation, transport/auth, libvirt/runtime.

### Output Artifact Requirements

- Canonical artifact file path: planning/JAVA-LIBVIRT-BACKEND-PLAN.md (updated sections)
- Ticket references from matrix rows to implementing tasks 33-40.

### Example Payloads

- Boundary matrix row sample

```json
{
  "flow": "create-connection.authenticate",
  "uiModule": "connection-auth",
  "classification": "libvirt-backed",
  "controllerFamily": "connection-auth",
  "serviceOwner": "ConnectionAuthService",
  "ticket": "task-35",
  "errorSources": ["validation", "transport", "libvirt"]
}
```

### Java DTO Mapping

- Boundary matrix row: BoundaryMatrixRowDto
- Error source entry: ErrorSourceDto
- Flow owner reference: FlowOwnerRefDto

### UI Impact Checklist

- [ ] Every Angular feature flow in tasks 21-31 appears in the boundary matrix
- [ ] Every matrix row links to one implementing backend ticket
- [ ] Metadata-only flows are explicitly marked as non-libvirt

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

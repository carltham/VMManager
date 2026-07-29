# Task 33 - service-controller-mapping

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, virtManager/host.py, virtManager/details/snapshots.py, virtManager/xmleditor.py, virtManager/oslist.py
- Flow Classes: vmmCreateConn -> vmmHost -> vmmSnapshotPage -> vmmXMLEditor -> vmmOSList
- Actions: map Python controllers to Java services, define REST endpoints, preserve existing manager/vm-details patterns.
- Action Flows:
  - map controllers to services: Python class inventory -> Spring package layout -> endpoint plan
  - define REST endpoints: flow list -> controller signatures -> DTO contracts
  - preserve patterns: manager/vm-details/vm-window code review -> reuse decisions -> implementation standards
- Scope: Create the Java service/controller mapping plan that translates original Python controllers into Spring packages.

## Frontend Contract

### Angular Integration Points

- manager API consumers: manager, create-connection, host-details, preferences, about
- vm-window API consumers: vm-window, console
- vm-details API consumers: vm-details, xml-editor, os-list
- future APIs needed by frontend: connection-auth, snapshots, async-job

### Canonical Endpoint Families

- manager: /api/manager/*
- vm-window: /api/vm-window/*
- vm-details: /api/vm-details/*
- connection-auth: /api/connection-auth/*
- snapshots: /api/snapshots/*
- jobs: /api/jobs/*

### DTO Contract Rules

- Keep existing response DTOs backward-compatible for already wired Angular calls.
- New endpoints must define request/response DTOs in ticket docs before implementation.
- Include stable error payload shape for all families:
  - { code, message, details?, retryable, correlationId }

### Example Payloads

- Standard error payload

```json
{
  "code": "AUTH_FAILED",
  "message": "Authentication failed for provided credentials.",
  "details": "Remote libvirt host rejected login.",
  "retryable": true,
  "correlationId": "corr-20260729-0001"
}
```

- Endpoint family mapping sample

```json
{
  "family": "vm-details",
  "controller": "VmDetailsController",
  "service": "VmDetailsService",
  "angularConsumers": ["vm-details", "xml-editor", "os-list"],
  "basePath": "/api/vm-details"
}
```

### Java DTO Mapping

- Standard API error payload: ApiErrorDto
- Endpoint family mapping: EndpointFamilyMappingDto
- Consumer mapping item: FrontendConsumerRefDto

### UI Impact Checklist

- [ ] Existing Angular endpoint calls remain valid
- [ ] New endpoint families are documented with request/response examples
- [ ] Error payload shape is identical across controller families

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

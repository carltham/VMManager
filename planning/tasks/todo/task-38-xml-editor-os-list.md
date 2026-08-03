# Task 38 - xml-editor-os-list


- Status: in-progress
- Verify: 90%
- Conversion Progress: [##################..] 90%
- Verification Progress: [##################..] 90%
- TDD UI Integration Test Progress: [##################..] 90%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/xmleditor.py, virtManager/oslist.py, virtManager/lib/uiutil.py
- Flow Classes: vmmXMLEditor -> vmmOSList
- Actions: open XML editor, edit XML, validate XML, apply XML, open OS list, filter OS entries, select OS, confirm OS.
- Action Flows:
  - open XML editor: VM details launch action -> XML editor endpoint -> editor state
  - edit/apply XML: XML notebook interaction -> backend apply endpoint -> libvirt XML update
  - open OS list: VM details launch action -> OS list endpoint -> OS selector state
  - filter/select OS: search/filter input -> backend-supported OS choices -> selection callback
- Scope: Backend support for XML editing and OS selection flows exposed from VM details.

## Concrete Sprint Tasks

- [x] Implement POST `/api/vm-details/{vmId}/xml/validate` with deterministic validation error list.
- [x] Implement GET `/api/vm-details/{vmId}/os-list` and query filtering support.
- [x] Ensure existing launch-xml-editor, launch-os-list, and apply endpoints stay backward-compatible.
- [x] Replace Angular hardcoded OS list with backend-driven options and preserve fallback behavior.
- [x] Render XML validation errors before apply in Angular xml-editor flow.
- [x] Add backend tests for XML valid/invalid and OS list query filtering behavior.
- [x] Add frontend tests for validation-error rendering and OS list selection flow.

### Validation Gate Commands

```bash
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q test
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/testing/playwright && env -u NODE_OPTIONS -u VSCODE_INSPECTOR_OPTIONS npx playwright test tests/tools.spec.mjs --reporter=list
```

## Frontend Contract

### Angular Integration Points

- xml-editor currently uses vm-details launch-xml-editor + edit-general + apply
- os-list currently uses vm-details launch-os-list + edit-general + apply

### Endpoint Contract

- POST /api/vm-details/{vmId}/launch-xml-editor
- POST /api/vm-details/{vmId}/apply
- POST /api/vm-details/{vmId}/xml/validate
  - request: { xml: string }
  - response: { valid: boolean, errors: string[] }
- GET /api/vm-details/{vmId}/os-list
  - response: { items: [{ id: string, label: string, family?: string }] }
- GET /api/vm-details/{vmId}/os-list?query={query}
  - response: filtered items payload

### Example Payloads

- POST /api/vm-details/7/xml/validate request

```json
{
  "xml": "<domain type=\"kvm\"><name>fedora-test</name></domain>"
}
```

- POST /api/vm-details/7/xml/validate response

```json
{
  "valid": false,
  "errors": [
    "Missing memory element",
    "Invalid devices ordering"
  ]
}
```

- GET /api/vm-details/7/os-list response

```json
{
  "items": [
    { "id": "fedora41", "label": "Fedora 41", "family": "linux" },
    { "id": "ubuntu2404", "label": "Ubuntu 24.04", "family": "linux" }
  ]
}
```

- GET /api/vm-details/7/os-list?query=fedora response

```json
{
  "items": [
    { "id": "fedora41", "label": "Fedora 41", "family": "linux" }
  ]
}
```

### Java DTO Mapping

- XML validation request: VmXmlValidationRequestDto
- XML validation response: VmXmlValidationResponseDto
- OS list response: VmOsListResponseDto
- OS list item: VmOsListItemDto
- Shared VM details response: VmDetailsViewDto

### Response Contract

- VmDetailsView should continue exposing:
  - xmlEditorOpen, osListOpen, statusMessage
- New optional fields for frontend quality:
  - validationErrors?: string[]
  - osChoices?: { id: string, label: string, family?: string }[]

### Error Mapping

- XML_INVALID -> editor validation message list
- OS_LIST_UNAVAILABLE -> os-list error banner
- APPLY_CONFLICT -> apply conflict message with retry guidance

### UI Impact Checklist

- [ ] Keep existing launch/apply flow working with current Angular calls
- [ ] Replace hardcoded OS choices with backend-provided choices when available
- [ ] Surface XML validation errors before apply

## Evidence

### Backend Evidence

- Files changed: `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmDetailsController.java`, `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmDetailsService.java`, `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmDetailsDto.java`, `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmXmlValidationResponseDto.java`, `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmOsListResponseDto.java`, `VMManager-web/src/main/java/com/noprobit/vmmanager/webapp/vmdetails/VmOsListItemDto.java`, `VMManager-web/src/test/java/com/noprobit/vmmanager/webapp/vmdetails/VmDetailsControllerTests.java`
- Command: `cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q -Dtest=VmDetailsControllerTests,VmWindowControllerTests,ManagerControllerTests,ConnectionAuthControllerTests test`
- Result: pass (vm-details tests: 3 run, 0 failures)

### Frontend Evidence

- Files changed: `VMManager-web/angular/src/app/vm-details/vm-details-api.service.ts`, `VMManager-web/angular/src/app/vm-details/vm-details.models.ts`, `VMManager-web/angular/src/app/xml-editor/xml-editor-api.service.ts`, `VMManager-web/angular/src/app/xml-editor/xml-editor.component.ts`, `VMManager-web/angular/src/app/xml-editor/xml-editor.component.html`, `VMManager-web/angular/src/app/xml-editor/xml-editor.models.ts`, `VMManager-web/angular/src/app/os-list/os-list-api.service.ts`, `VMManager-web/angular/src/app/os-list/os-list.component.ts`, `VMManager-web/angular/src/app/os-list/os-list.component.html`, `VMManager-web/angular/src/app/os-list/os-list.models.ts`, `VMManager-web/angular/src/app/app.spec.ts`, `testing/playwright/tests/tools.spec.mjs`, `testing/playwright/tests/machines.spec.mjs`
- Command: `cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build`
- Result: pass

### Integration Evidence

- Entry point: App shell -> View -> Tools -> XML Editor and OS List panels
- Executed actions: Open editor, apply invalid XML (show validation errors), apply valid XML, open OS list, filter by query, select/apply OS
- Result: pass (`testing/playwright/tests/tools.spec.mjs`)

### Parity Evidence

- Covered original flows: open XML editor, edit/apply XML with validation, open OS list, filter OS entries, select/apply OS
- Known deviations: backend uses deterministic mock validation/OS catalog; no real libvirt XML parse or host OS introspection

## Integration Test Evidence

### Python UI Integration Baseline

- Test file(s): <python integration test paths>
- Cases: <case names>
- Result: <pass/fail>

### Angular Integration or E2E Match

- Test file(s): `testing/playwright/tests/tools.spec.mjs`
- Cases: `opens xml editor and os list then applies changes`
- Result: pass

### Mapping Table

| Python test case | Angular test case | Status |
| --- | --- | --- |
| xml validation + os list selection flow | opens xml editor and os list then applies changes | pass |

### Notes

- Approved behavior differences: <none or documented deviations>

# Task 38 - xml-editor-os-list

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Overall Progress: [....................] 0%
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

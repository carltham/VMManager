# Task 38 - xml-editor-os-list

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
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

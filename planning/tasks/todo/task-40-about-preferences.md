# Task 40 - about-preferences

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Overall Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/about.py, virtManager/preferences.py
- Flow Classes: vmmAbout -> vmmPreferences
- Actions: load app metadata, load preference defaults, expose non-libvirt settings as endpoints.
- Action Flows:
  - load app metadata: about endpoint -> app info DTO -> UI display
  - load preference defaults: preferences endpoint -> config DTO -> UI display
  - expose non-libvirt settings: settings/config service -> endpoint contract -> Angular binding
- Scope: Thin Java endpoints for application metadata and preferences, intentionally without libvirt calls.

## Frontend Contract

### Angular Integration Points

- about component calls manager/about endpoint
- preferences component calls manager/preferences endpoint

### Endpoint Contract

- GET /api/manager/about
  - response: { name: string, module: string, version: string }
- GET /api/manager/preferences
  - response: { theme: string, defaultConnectionUri: string, autoConnect: string }

### Example Payloads

- GET /api/manager/about response

```json
{
  "name": "VMManager",
  "module": "VMManager-web",
  "version": "1.0.0"
}
```

- GET /api/manager/preferences response

```json
{
  "theme": "light",
  "defaultConnectionUri": "qemu:///system",
  "autoConnect": "true"
}
```

### Java DTO Mapping

- About response: AboutInfoDto
- Preferences response: PreferencesDto

### Error Mapping

- CONFIG_UNAVAILABLE -> preferences load error banner
- METADATA_UNAVAILABLE -> about load error banner

### UI Impact Checklist

- [ ] Preserve current key names consumed by Angular views
- [ ] Maintain non-libvirt classification for this ticket
- [ ] Keep responses lightweight and cacheable

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

# Task XX - <name>

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Overall Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/<controller>.py, ui/<ui-file>.ui, virtManager/<dependency-1>.py, virtManager/<dependency-2>.py
- Flow Classes: <main controller class> -> <secondary/helper class> -> <service/helper class>
- Actions: <action-1>, <action-2>, <action-3>
- Action Flows:
	- <action-1>: <signal/click source> -> <controller method> -> <helper/service class>
	- <action-2>: <signal/click source> -> <controller method> -> <helper/service class>
	- <action-3>: <signal/click source> -> <controller method> -> <helper/service class>
- Scope: Short description of the flow, main widgets, signals, and behavior to verify.

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

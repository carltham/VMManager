# Task 35 - create-connection-auth

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, virtManager/lib/connectauth.py
- Flow Classes: vmmCreateConn -> _vmmConnectAuth
- Actions: open connection dialog, build libvirt URI, authenticate credentials, remember connection, reject invalid host input.
- Action Flows:
  - open connection dialog: File->Add Connection -> backend open endpoint -> create connection UI state
  - build libvirt URI: hypervisor/remote controls -> URI synthesis -> connection request payload
  - authenticate credentials: auth prompt -> libvirt openAuth path -> credential exchange
  - remember connection: auth failure recovery -> remember choice -> persisted connection behavior
- Scope: Real backend endpoints and service logic for creating and authenticating libvirt connections.

## Concrete Sprint Tasks

- [ ] Implement POST `/api/manager/connections` with URI validation and deterministic error codes.
- [ ] Implement POST `/api/connection-auth/sessions` and DELETE `/api/connection-auth/sessions/{sessionId}`.
- [ ] Persist remember-connection behavior and session expiration handling in service layer.
- [ ] Replace simulated Angular connection-auth API calls with HttpClient endpoint calls.
- [ ] Add UI handling for `AUTH_REQUIRED`, `AUTH_FAILED`, `INVALID_URI`, and `HOST_UNREACHABLE`.
- [ ] Add backend tests for success, invalid URI, auth failure, and host unreachable.
- [ ] Add frontend tests for auth form validation and error state rendering.

### Validation Gate Commands

```bash
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web && ./mvnw -q test
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm run build
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/VMManager-web/angular && npm test -- --watch=false --browsers=ChromeHeadless
cd /mnt/DATA/Projects/0.present-projects/Active/VMManager/testing/playwright && env -u NODE_OPTIONS -u VSCODE_INSPECTOR_OPTIONS npx playwright test tests/tools.spec.mjs --reporter=list
```

## Frontend Contract

### Angular Integration Points

- create-connection service currently calls manager overview + add connection
- connection-auth service currently simulated and must switch to backend HTTP

### Endpoint Contract

- GET /api/manager/overview
  - response: existing overview DTO with connections[]
- POST /api/manager/connections
  - request: { name: string, uri: string }
  - response: connection item DTO { id, name, uri, state, vms[] }
- POST /api/connection-auth/sessions
  - request: { connectionId: number, username: string, password: string, remember: boolean }
  - response: { success: boolean, message: string, sessionId?: string, expiresAt?: string }
- DELETE /api/connection-auth/sessions/{sessionId}
  - response: { success: boolean, message: string }

### Example Payloads

- POST /api/manager/connections request

```json
{
  "name": "local-qemu",
  "uri": "qemu:///system"
}
```

- POST /api/manager/connections response

```json
{
  "id": 101,
  "name": "local-qemu",
  "uri": "qemu:///system",
  "state": "CONNECTED",
  "vms": []
}
```

- POST /api/connection-auth/sessions request

```json
{
  "connectionId": 101,
  "username": "root",
  "password": "<redacted>",
  "remember": true
}
```

- POST /api/connection-auth/sessions response

```json
{
  "success": true,
  "message": "Authentication successful.",
  "sessionId": "sess_9bf3a8",
  "expiresAt": "2026-07-30T09:00:00Z"
}
```

- DELETE /api/connection-auth/sessions/{sessionId} response

```json
{
  "success": true,
  "message": "Session closed."
}
```

### Java DTO Mapping

- Create connection request: CreateConnectionRequestDto
- Connection summary response: ConnectionItemDto
- Auth session create request: ConnectionAuthSessionCreateRequestDto
- Auth session create response: ConnectionAuthSessionResponseDto
- Auth session close response: ConnectionAuthSessionCloseResponseDto

### Error Mapping

- INVALID_URI -> inline create-connection form error
- AUTH_REQUIRED -> open connection-auth prompt state
- AUTH_FAILED -> connection-auth error banner
- HOST_UNREACHABLE -> connection/auth network error message

### UI Impact Checklist

- [ ] Replace simulated connection-auth API service with HttpClient endpoint calls
- [ ] Preserve existing create-connection success and error messaging behavior
- [ ] Add handling for AUTH_REQUIRED and AUTH_FAILED response codes

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

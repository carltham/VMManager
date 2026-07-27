# Task Completion Criteria

This document defines the required completion standards for all task files in:
- planning/tasks/todo
- planning/tasks/to-verify

It is the single source of truth for setting:
- Status
- Verify
- Conversion Progress
- Verification Progress
- TDD UI Integration Test Progress

## 1. Core Principles

1. No optimistic completion.
Only measurable implementation and evidence can increase progress.

2. Original parity matters.
Task completion is measured against original components in:
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/virtManager
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/virtManager/device
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/ui

3. Done is not the same as verified.
A task can be converted without being fully verified.

## 2. Field Definitions

### Status
- todo: Not started.
- in-progress: Some implementation exists, but completion criteria are not met.
- done: Conversion is complete and all required checks pass.

### Verify
- Numeric confidence/result indicator (0-100).
- Must be evidence-based (build/test/runtime checks), not manual guesswork.

### Conversion Progress
Measures implementation completeness against original component scope.

### Verification Progress
Measures test/validation evidence quality for implemented behavior.

### TDD UI Integration Test Progress
Measures parity progress of matched Python UI integration tests and Angular integration/e2e tests.

## 3. Objective Scoring Model

Each task progress is computed from three objective checks.

### Conversion Progress Formula
- Backend module present and wired: +50
- Frontend module present (models/api/component and template/style when applicable): +30
- App shell/workflow integration present (invocation/wiring/navigation): +20

Conversion Progress = 0 to 100

### Verification Progress Formula
- Backend validation evidence (build/tests/API behavior): +30
- Frontend validation evidence (build/render/interaction): +30
- Integration evidence (end-to-end invocation path wired): +20
- Explicit parity checks against original flow/actions: +20

Verification Progress = 0 to 100

Constraint:
- Verification Progress cannot exceed Conversion Progress.

### TDD UI Integration Test Progress Formula
- Python UI integration tests for task flow exist: +40
- Matching Angular integration/e2e tests exist: +40
- Both suites passing for mapped cases: +20

TDD UI Integration Test Progress = 0 to 100

## 4. Strict 100% Requirements

A task may be marked 100% Conversion only when all are true:
1. Every action listed in the task is implemented in backend service/controller endpoints.
2. A corresponding frontend module exists and supports the required UI actions.
3. The module is integrated into the app flow (reachable and triggerable).
4. Required task dependencies (dialogs/sub-flows listed in UIModule/Flow Classes) are either implemented or explicitly mapped and justified.

A task may be marked 100% Verification only when all are true:
1. Backend tests/build pass.
2. Frontend build passes.
3. Behavior checks confirm each task action path works.
4. Parity review completed against original Python/UI component behavior.
5. No known critical gaps remain for that task scope.
6. Integration test parity is satisfied per Section 10.

A task may be marked 100% TDD UI Integration Test Progress only when all are true:
1. Python UI integration tests exist for the task behavior baseline.
2. Matching Angular integration/e2e tests exist for equivalent flows.
3. Both test suites pass for mapped cases.
4. Mapping evidence is recorded per Section 10.3.

## 5. Status Transition Rules

### todo -> in-progress
Set when any implementation starts (code added/modified).

### in-progress -> done
Allowed only if:
- Conversion Progress is 100
- Verification Progress is 100
- Verify field is 100
- Evidence section is updated (see Section 6)

If Conversion or Verification is below 100, Status must remain in-progress.

## 6. Required Evidence Block (per task)

When updating a task, include evidence in the task file (or linked verification note):

1. Backend evidence
- Controllers/services added or updated
- Test command and result

2. Frontend evidence
- Component/service/template wiring added or updated
- Build command and result

3. Integration evidence
- How the module is reached from app shell
- Which actions were manually/automatically exercised

4. Parity evidence
- Which original action flows are fully covered
- Any residual deviations

## 7. Prohibited Practices

1. Do not set Status: done when frontend module is missing.
2. Do not set Verify: 100 when parity gaps are known.
3. Do not keep 100% bars based only on previous status text.
4. Do not move tasks to to-verify unless they satisfy completion gates.

## 8. Canonical Interpretation for Existing Tasks

For already-created tasks:
- Recalculate Conversion Progress and Verification Progress using Section 3.
- If progress is below 100, set Status to in-progress.
- Keep Verify aligned with current evidence.

## 9. Maintenance

When scoring rules evolve, update this file first, then re-score task files consistently.

## 10. Final Verification by Integration-Test Parity

Final verification is integration-test driven and must compare original Python behavior with Angular behavior.

### 10.1 Required Approach
1. For each task, define a matched integration test set:
- Python integration test case(s) for the original component flow.
- Angular integration/e2e test case(s) for the converted flow.

2. The Angular task is considered fully verified only when matched test cases pass on both sides for equivalent behavior.

### 10.2 If Python UI Integration Tests Are Missing
1. Write the Python UI integration tests first.
2. Establish those tests as the baseline reference behavior.
3. Then implement matching Angular integration tests.
4. Only after both suites pass can Verification Progress reach 100%.

### 10.3 Minimum Evidence Required per Task
Include these artifacts in task evidence:
1. Python integration test file path(s) and pass result.
2. Angular integration/e2e test file path(s) and pass result.
3. Mapping table: Python test case -> Angular test case.
4. Notes for any intentionally different behavior (must be approved and documented).

### 10.4 Gating Rule
If no matched Python/Angular integration test evidence exists, then:
- Verification Progress must remain below 100%.
- Status must not be set to done.

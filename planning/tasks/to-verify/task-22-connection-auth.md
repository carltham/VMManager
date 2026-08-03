# Task 22 - connection-auth


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (connection-auth validate/success modes)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/lib/connectauth.py, ui/connectauth.ui, virtManager/lib/uiutil.py
- Flow Classes: _vmmConnectAuth
- Actions: prompt credentials, submit authentication, cancel, retry.
- Action Flows:
  - prompt credentials: <signal/click source> -> _vmmConnectAuth -> <helper/service class>
  - submit authentication: <signal/click source> -> _vmmConnectAuth -> <helper/service class>
  - cancel: <signal/click source> -> _vmmConnectAuth -> <helper/service class>
  - retry: <signal/click source> -> _vmmConnectAuth -> <helper/service class>
- Scope: Authentication dialog, credential prompts, and response handling.

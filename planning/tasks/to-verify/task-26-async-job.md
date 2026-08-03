# Task 26 - async-job


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (async-job start/cancel/complete)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/asyncjob.py, ui/asyncjob.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmAsyncJob -> _vmmMeter
- Actions: start job, monitor progress, cancel job, close dialog.
- Action Flows:
  - start job: <signal/click source> -> vmmAsyncJob -> <helper/service class>
  - monitor progress: <signal/click source> -> vmmAsyncJob -> <helper/service class>
  - cancel job: <signal/click source> -> vmmAsyncJob -> <helper/service class>
  - close dialog: <signal/click source> -> vmmAsyncJob -> <helper/service class>
- Scope: Async job dialog, progress reporting, cancellation, and error handling.

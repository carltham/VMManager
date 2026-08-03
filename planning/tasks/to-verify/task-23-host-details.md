# Task 23 - host-details


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (host-details load metrics)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/host.py, ui/host.ui, virtManager/baseclass.py, virtManager/connmanager.py, virtManager/lib/uiutil.py
- Flow Classes: vmmHost -> vmmConnectionManager
- Actions: open, close, refresh host details, inspect host properties, manage host actions.
- Action Flows:
  - open: <signal/click source> -> vmmHost -> <helper/service class>
  - close: <signal/click source> -> vmmHost -> <helper/service class>
  - refresh host details: <signal/click source> -> vmmHost -> <helper/service class>
  - inspect host properties: <signal/click source> -> vmmHost -> <helper/service class>
  - manage host actions: <signal/click source> -> vmmHost -> <helper/service class>
- Scope: Host details window, information panes, host actions, and update cycle.

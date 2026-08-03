# Task 29 - os-list


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (os-list open/apply)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/oslist.py, ui/oslist.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmOSList
- Actions: open, close, filter OS list, select OS, confirm OS, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmOSList -> <helper/service class>
  - close: <signal/click source> -> vmmOSList -> <helper/service class>
  - filter OS list: <signal/click source> -> vmmOSList -> <helper/service class>
  - select OS: <signal/click source> -> vmmOSList -> <helper/service class>
  - confirm OS: <signal/click source> -> vmmOSList -> <helper/service class>
  - cancel: <signal/click source> -> vmmOSList -> <helper/service class>
- Scope: OS list dialog, selection filtering, and OS metadata presentation.

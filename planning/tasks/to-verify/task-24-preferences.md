# Task 24 - preferences


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (preferences refresh/load)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/preferences.py, ui/preferences.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmPreferences
- Actions: open, close, change settings, apply changes, reset settings, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmPreferences -> <helper/service class>
  - close: <signal/click source> -> vmmPreferences -> <helper/service class>
  - change settings: <signal/click source> -> vmmPreferences -> <helper/service class>
  - apply changes: <signal/click source> -> vmmPreferences -> <helper/service class>
  - reset settings: <signal/click source> -> vmmPreferences -> <helper/service class>
  - cancel: <signal/click source> -> vmmPreferences -> <helper/service class>
- Scope: Preferences dialog, settings controls, persistence, and reset/apply behavior.

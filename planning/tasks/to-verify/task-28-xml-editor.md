# Task 28 - xml-editor


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (xml-editor open/apply)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/xmleditor.py, ui/xmleditor.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmXMLEditor
- Actions: open, close, edit XML, validate XML, apply XML, save XML, revert changes.
- Action Flows:
  - open: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - close: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - edit XML: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - validate XML: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - apply XML: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - save XML: <signal/click source> -> vmmXMLEditor -> <helper/service class>
  - revert changes: <signal/click source> -> vmmXMLEditor -> <helper/service class>
- Scope: XML editor dialog, text editing, validation, and save/apply flow.

# Task 30 - snapshots


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Last web PW run: tools.spec.mjs **6 passed**.
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/tools.spec.mjs (snapshots create/revert/delete)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/details/snapshots.py, ui/snapshots.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmSnapshotPage -> vmmSnapshotNew
- Actions: open, close, refresh snapshots, create snapshot, delete snapshot, revert snapshot.
- Action Flows:
  - open: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - close: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - refresh snapshots: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - create snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - delete snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - revert snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
- Scope: Snapshot list view, actions, refresh behavior, and snapshot lifecycle.

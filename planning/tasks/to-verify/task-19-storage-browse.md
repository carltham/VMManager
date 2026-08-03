# Task 19 - storage-browse


- Status: conversion-complete (web evidence green; verify 0%)
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Last web PW run: network-storage.spec.mjs **4 passed** (storage deep paths green).
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/network-storage.spec.mjs (browse open/select/confirm/cancel/close)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/storagebrowse.py, ui/storagebrowse.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmStorageBrowser
- Actions: open, close, navigate tree, expand folders, select path, confirm path, cancel.
- Action Flows:
  - open: Storage Browse open button -> StorageBrowseComponent.toggleOpen() -> StorageBrowseComponent.openBrowser() -> POST /storage/browse/open
  - close: Cancel button -> StorageBrowseComponent.cancel() -> view.open = false
  - navigate tree: path entry selection -> StorageBrowseComponent.select(entry) -> view.selectedPath updated
  - expand folders: not implemented in current Angular component
  - select path: entry click -> StorageBrowseComponent.select(entry) -> POST /storage/browse/select
  - confirm path: Confirm button -> StorageBrowseComponent.confirm() -> POST /storage/browse/confirm
  - cancel: Cancel button -> StorageBrowseComponent.cancel() -> view.open = false
- Scope: Storage browsing panel, path selection, and confirmation flow.

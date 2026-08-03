# Task 09 - add-storage


- Status: in-progress
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Web implementation evidence: testing/playwright/tests/machines.spec.mjs - Add Storage configures source, storage path, format, and size, then exercises cancel, attach, and close. This is not reference verification.
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/addstorage.py, ui/addstorage.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py, virtManager/storagebrowse.py
- Flow Classes: vmmAddStorage, vmmStorageBrowser
- Actions: open, close, browse source, select storage path, change format, change size, attach storage, cancel.
- Action Flows:
  - open add-storage dialog: `vmmAddStorage.__init__()` sets up the storage UI and signal bindings
  - close: dialog close route via parent dialog cancel/close handlers
  - browse source: `on_storage_browse_clicked` -> `vmmAddStorage._browse_storage()`
  - select storage path: `on_storage_select_toggled` -> `vmmAddStorage._toggle_storage_select()`
  - change format: `on_disk_cache_combo_changed` and storage combo events -> `vmmAddStorage._change_cb()`
  - change size: numeric input changes update the storage device model
  - attach storage: attach action is committed through `vmmAddStorage.build_device()` and parent dialog apply flow
  - cancel: cancel route closes the add-storage UI
- Scope: storage device configuration, browse path, format and size controls, and attach flow.

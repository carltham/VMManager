# Task 06 - delete-vm

- Status: in-progress
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Web implementation evidence: testing/playwright/tests/machines.spec.mjs - Delete VM flow opens, toggles associated storage removal, closes and reopens the dialog, confirms deletion, and verifies the VM row is removed. The same suite also covers cancellation. This is not reference verification.
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/delete.py, ui/delete.ui, virtManager/asyncjob.py, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmDeleteDialog, vmmDeleteStorage, vmmAsyncJob
- Actions: open, close, toggle remove storage, confirm delete, cancel delete.
- Action Flows:
  - open delete dialog: `vmmDeleteDialog.show()` is triggered by manager delete action
  - close dialog: `on_vmm_delete_delete_event` / `on_delete_cancel_clicked` -> `vmmDeleteDialog.close()`
  - toggle remove storage: `on_delete_remove_storage_toggled` -> `vmmDeleteDialog._toggle_remove_storage()`
  - confirm delete: `on_delete_ok_clicked` -> `vmmDeleteDialog._finish_clicked_cb()`
  - cancel delete: `on_delete_cancel_clicked` -> `vmmDeleteDialog.close()`
- Scope: Delete confirmation dialog, storage removal option, and destructive VM deletion workflow.

# Task 06 - delete-vm

- Status: in-progress
- Verify: 80%
- Conversion Progress: [####################] 100%
- Verification Progress: [################....] 80%
- TDD UI Integration Test Progress: [....................] 0%
- Overall Progress: [############........] 60%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
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

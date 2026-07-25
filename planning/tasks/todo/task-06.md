# Task 06 - delete-vm

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/delete.py, ui/delete.ui, virtManager/asyncjob.py, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmDeleteDialog -> vmmDeleteStorage -> vmmAsyncJob
- Actions: open, close, toggle remove storage, confirm delete, cancel delete.
- Action Flows:
  - open: <signal/click source> -> vmmDeleteDialog -> <helper/service class>
  - close: <signal/click source> -> vmmDeleteDialog -> <helper/service class>
  - toggle remove storage: <signal/click source> -> vmmDeleteDialog -> <helper/service class>
  - confirm delete: <signal/click source> -> vmmDeleteDialog -> <helper/service class>
  - cancel delete: <signal/click source> -> vmmDeleteDialog -> <helper/service class>
- Scope: Delete confirmation dialog, deletion choices, and destructive action guardrails.

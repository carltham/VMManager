# Task 10 - filesystem-details

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/fsdetails.py, ui/fsdetails.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmFSDetails
- Actions: open, close, edit filesystem path, edit target, apply changes, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmFSDetails -> <helper/service class>
  - close: <signal/click source> -> vmmFSDetails -> <helper/service class>
  - edit filesystem path: <signal/click source> -> vmmFSDetails -> <helper/service class>
  - edit target: <signal/click source> -> vmmFSDetails -> <helper/service class>
  - apply changes: <signal/click source> -> vmmFSDetails -> <helper/service class>
  - cancel: <signal/click source> -> vmmFSDetails -> <helper/service class>
- Scope: Filesystem device details, mapping controls, and edit/update behavior.

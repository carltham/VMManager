# Task 29 - os-list

- Status: todo
- Verify: 0%
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

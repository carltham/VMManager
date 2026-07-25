# Task 11 - graphics-details

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/gfxdetails.py, ui/gfxdetails.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmGraphicsDetails
- Actions: open, close, change graphics type, change listen/port/key options, apply changes, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
  - close: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
  - change graphics type: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
  - change listen/port/key options: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
  - apply changes: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
  - cancel: <signal/click source> -> vmmGraphicsDetails -> <helper/service class>
- Scope: Graphics device details, display type selection, and access/security settings.

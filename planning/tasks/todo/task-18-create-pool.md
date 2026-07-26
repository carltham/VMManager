# Task 18 - create-pool

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createpool.py, ui/createpool.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmCreatePool
- Actions: open, close, select pool type, set source, set target, create pool, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - close: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - select pool type: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - set source: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - set target: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - create pool: <signal/click source> -> vmmCreatePool -> <helper/service class>
  - cancel: <signal/click source> -> vmmCreatePool -> <helper/service class>
- Scope: Storage pool wizard, backend selection, source/target details, and creation steps.

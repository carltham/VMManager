# Task 20 - host-storage

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/hoststorage.py, ui/hoststorage.ui, virtManager/baseclass.py, virtManager/connmanager.py, virtManager/lib/uiutil.py
- Flow Classes: vmmHostStorage -> vmmConnectionManager
- Actions: open, close, refresh pools, start pool, stop pool, delete pool, inspect volumes, create volume.
- Action Flows:
  - open: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - close: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - refresh pools: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - start pool: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - stop pool: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - delete pool: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - inspect volumes: <signal/click source> -> vmmHostStorage -> <helper/service class>
  - create volume: <signal/click source> -> vmmHostStorage -> <helper/service class>
- Scope: Host storage management, pool actions, volume listing, and refresh behavior.

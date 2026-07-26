# Task 17 - create-volume

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createvol.py, ui/createvol.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py, virtManager/storagebrowse.py
- Flow Classes: vmmCreateVolume -> vmmStorageBrowser
- Actions: open, close, select pool, browse path, set name, set format, set size, create volume, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - close: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - select pool: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - browse path: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - set name: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - set format: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - set size: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - create volume: <signal/click source> -> vmmCreateVolume -> <helper/service class>
  - cancel: <signal/click source> -> vmmCreateVolume -> <helper/service class>
- Scope: Volume creation dialog, pool selection, size/format controls, and create flow.

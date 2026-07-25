# Task 05 - clone-vm

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/clone.py, ui/clone.ui, virtManager/asyncjob.py, virtManager/baseclass.py, virtManager/storagebrowse.py, virtManager/lib/uiutil.py
- Flow Classes: vmmCloneVM -> vmmAsyncJob -> vmmStorageBrowser
- Actions: open, close, select source VM, choose clone/share mode, browse destination, change disk options, confirm clone.
- Action Flows:
  - open: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - close: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - select source VM: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - choose clone/share mode: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - browse destination: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - change disk options: <signal/click source> -> vmmCloneVM -> <helper/service class>
  - confirm clone: <signal/click source> -> vmmCloneVM -> <helper/service class>
- Scope: Clone dialog, source selection, name/options handling, and copy workflow.

# Task 19 - storage-browse

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/storagebrowse.py, ui/storagebrowse.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmStorageBrowser
- Actions: open, close, navigate tree, expand folders, select path, confirm path, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - close: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - navigate tree: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - expand folders: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - select path: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - confirm path: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
  - cancel: <signal/click source> -> vmmStorageBrowser -> <helper/service class>
- Scope: Storage browse dialog, file tree interactions, selection, and path handling.

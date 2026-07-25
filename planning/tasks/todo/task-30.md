# Task 30 - snapshots

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/details/snapshots.py, ui/snapshots.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmSnapshotPage -> vmmSnapshotNew
- Actions: open, close, refresh snapshots, create snapshot, delete snapshot, revert snapshot.
- Action Flows:
  - open: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - close: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - refresh snapshots: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - create snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - delete snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
  - revert snapshot: <signal/click source> -> vmmSnapshotPage -> <helper/service class>
- Scope: Snapshot list view, actions, refresh behavior, and snapshot lifecycle.

# Task 30 - snapshots

- Status: in-progress
- Verify: 35%
- Conversion Progress: [##########..........] 50%
- Verification Progress: [#######.............] 35%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
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

# Task 31 - snapshot-new

- Status: in-progress
- Verify: 35%
- Conversion Progress: [##########..........] 50%
- Verification Progress: [#######.............] 35%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-21-31.md
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/details/snapshots.py, ui/snapshotsnew.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmSnapshotNew
- Actions: open, close, enter snapshot name, configure snapshot options, create snapshot, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
  - close: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
  - enter snapshot name: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
  - configure snapshot options: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
  - create snapshot: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
  - cancel: <signal/click source> -> vmmSnapshotNew -> <helper/service class>
- Scope: New snapshot dialog, snapshot naming/options, and creation flow.

# Task 13 - vsock-details


- Status: in-progress
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/machines.spec.mjs (vsock toggle/cancel/apply/close)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/vsockdetails.py, ui/vsockdetails.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmVsockDetails
- Actions: open, close, toggle auto CID, edit CID, apply changes, cancel.
- Action Flows:
  - open VSock details: `vmmVsockDetails.__init__()` builds the VSock pane
  - close: parent dialog close hides VSock pane
  - toggle auto CID: `on_vsock_auto_toggled` -> `vmmVsockDetails._vsock_auto_toggled()`
  - edit CID: `on_vsock_cid_changed` -> `vmmVsockDetails.emit("changed-cid")`
  - apply changes: parent dialog commit path through `vmmVsockDetails.get_values()`
  - cancel: parent dialog cancel hides the pane
- Scope: VSock device details, auto CID toggle, CID entry, and commit flow.

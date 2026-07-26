# Task 12 - tpm-details

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/tpmdetails.py, ui/tpmdetails.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmTPMDetails
- Actions: open, close, change TPM model, change version, change device path, apply changes, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - close: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - change TPM model: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - change version: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - change device path: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - apply changes: <signal/click source> -> vmmTPMDetails -> <helper/service class>
  - cancel: <signal/click source> -> vmmTPMDetails -> <helper/service class>
- Scope: TPM device details, model/format options, and validation.

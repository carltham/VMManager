# Task 15 - network-list

- Status: in-progress
- Verify: 80%
- Conversion Progress: [####################] 100%
- Verification Progress: [################....] 80%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/netlist.py, ui/netlist.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmNetworkList
- Actions: open, close, select network, confirm source, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmNetworkList -> <helper/service class>
  - close: <signal/click source> -> vmmNetworkList -> <helper/service class>
  - select network: <signal/click source> -> vmmNetworkList -> <helper/service class>
  - confirm source: <signal/click source> -> vmmNetworkList -> <helper/service class>
  - cancel: <signal/click source> -> vmmNetworkList -> <helper/service class>
- Scope: Network list dialog, item selection, and network source selection behavior.

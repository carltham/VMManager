# Task 14 - create-network

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createnet.py, ui/createnet.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmCreateNetwork
- Actions: open, close, back, next, configure network, set address range, review, create network, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - close: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - back: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - next: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - configure network: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - set address range: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - review: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - create network: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
  - cancel: <signal/click source> -> vmmCreateNetwork -> <helper/service class>
- Scope: Network creation wizard, address allocation, and final create flow.

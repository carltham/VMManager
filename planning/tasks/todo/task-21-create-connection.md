# Task 21 - create-connection

- Status: todo
- Verify: 0%
- Conversion Progress: [....................] 0%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/createconn.py, ui/createconn.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmCreateConn -> vmmConnectAuth
- Actions: open, close, choose connection type, enter URI, authenticate, confirm connection, cancel.
- Action Flows:
  - open: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - close: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - choose connection type: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - enter URI: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - authenticate: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - confirm connection: <signal/click source> -> vmmCreateConn -> <helper/service class>
  - cancel: <signal/click source> -> vmmCreateConn -> <helper/service class>
- Scope: Connection creation dialog, URI/auth fields, and validation/submit flow.

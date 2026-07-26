# Task 07 - migrate-vm

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/migrate.py, ui/migrate.ui, virtManager/asyncjob.py, virtManager/baseclass.py, virtManager/connmanager.py, virtManager/object/domain.py, virtManager/xmleditor.py, virtManager/lib/uiutil.py
- Flow Classes: vmmMigrateDialog -> vmmXMLEditor -> vmmConnectionManager -> vmmDomain -> vmmAsyncJob
- Actions: open, close, choose destination, toggle address, toggle port, change migration mode, edit XML preview, finish migration, cancel migration.
- Action Flows:
  - open: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - close: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - choose destination: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - toggle address: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - toggle port: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - change migration mode: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - edit XML preview: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - finish migration: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
  - cancel migration: <signal/click source> -> vmmMigrateDialog -> <helper/service class>
- Scope: Migration dialog, destination selection, migration mode, and validation.

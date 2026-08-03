# Task 11 - graphics-details


- Status: in-progress
- Verify: 0%
- Conversion Progress: [####################] 100%
- Verification Progress: [....................] 0%
- TDD UI Integration Test Progress: [....................] 0%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Web implementation evidence (Angular Playwright only; not reference verification): testing/playwright/tests/machines.spec.mjs (graphics cancel/apply/close)
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/device/gfxdetails.py, ui/gfxdetails.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py
- Flow Classes: vmmGraphicsDetails
- Actions: open, close, show password, toggle port auto, toggle OpenGL, change graphics type, change listen type, edit address, edit port, apply changes, cancel.
- Action Flows:
  - open graphics details: `vmmGraphicsDetails.__init__()` builds the graphics pane
  - close: parent dialog close hides the graphics pane
  - change graphics type: `on_graphics_type_changed` -> `vmmGraphicsDetails._change_cb(EDIT_GFX_TYPE)`
  - change listen type/address/port: `on_graphics_listen_type_changed` / `on_graphics_address_changed` / `on_graphics_port_changed` -> `_change_cb(EDIT_GFX_LISTEN)` / `_change_cb(EDIT_GFX_PORT)`
  - toggle port auto: `on_graphics_port_auto_toggled` -> `vmmGraphicsDetails._change_port_auto()`
  - toggle OpenGL: `on_graphics_opengl_toggled` -> `_change_cb(EDIT_GFX_OPENGL)`
  - show password: `on_graphics_show_password` -> `vmmGraphicsDetails._show_password_cb()`
  - apply changes: parent dialog commit path through `vmmGraphicsDetails`
  - cancel: parent dialog cancel closes the pane
- Scope: graphics adapter settings, listen/address/port controls, and video device configuration.

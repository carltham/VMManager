# Task 27 - console

- Status: todo
- Verify: 0%
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/
- UIModule: virtManager/details/console.py, ui/console.ui, virtManager/baseclass.py, virtManager/lib/uiutil.py, virtManager/lib/graphwidgets.py
- Flow Classes: vmmConsolePages -> _ConsoleMenu -> vmmOverlayToolbar -> _TimedRevealer
- Actions: open, close, connect viewer, grab keyboard, resize console, toggle fullscreen, switch display or serial view.
- Action Flows:
  - open: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - close: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - connect viewer: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - grab keyboard: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - resize console: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - toggle fullscreen: <signal/click source> -> vmmConsolePages -> <helper/service class>
  - switch display or serial view: <signal/click source> -> vmmConsolePages -> <helper/service class>
- Scope: Console view, display integration, keyboard grab options, and viewer lifecycle.

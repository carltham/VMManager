# Task 03 - vm-details

## Metadata

- Status: in-progress
- Verify: 80%
- Conversion Progress: [####################] 100%
- Verification Progress: [################....] 80%
- TDD UI Integration Test Progress: [....................] 0%
- Overall Progress: [############........] 60%
- Evidence: planning/tasks/verify/IMPLEMENTATION-EVIDENCE-01-20.md
- Original project ROOT: /mnt/DATA/Projects/0.present-projects/Active/virt-manager/

## UIModule

- Controller and UI:
	- virtManager/details/details.py
	- ui/details.ui
- Dependencies:
	- virtManager/addhardware.py
	- virtManager/baseclass.py
	- virtManager/delete.py
	- virtManager/device/addstorage.py
	- virtManager/device/fsdetails.py
	- virtManager/device/gfxdetails.py
	- virtManager/device/netlist.py
	- virtManager/device/tpmdetails.py
	- virtManager/device/vsockdetails.py
	- virtManager/lib/graphwidgets.py
	- virtManager/lib/uiutil.py
	- virtManager/oslist.py
	- virtManager/storagebrowse.py
	- virtManager/xmleditor.py

## Flow Map

- Flow Classes:
	- vmmDetails
	- vmmAddHardware
	- vmmDeleteDialog/vmmDeleteStorage
	- vmmAddStorage
	- vmmFSDetails
	- vmmGraphicsDetails
	- vmmNetworkList
	- vmmTPMDetails
	- vmmVsockDetails
	- vmmXMLEditor
	- vmmStorageBrowser
	- vmmOSList

- Actions:
  - open details
  - refresh details
  - select hardware
  - edit general name/settings
  - edit CPU
  - edit memory
  - edit boot
  - add hardware
  - remove hardware
  - edit storage device
  - open network source dialog
  - open graphics settings
  - open TPM settings
  - open VSOCK settings
  - launch XML editor
  - launch storage browser
  - launch OS list
  - apply changes

- Action Flows:
  - open details: host/manager selects VM and calls `vmmDetails.show()`
  - refresh details: details UI state is refreshed through `vmmDetails._refresh()` and related callbacks in `virtManager/details/details.py`
  - select hardware: details UI emits `on_hw_list_changed` -> `vmmDetails._hw_changed_cb()`
  - edit general settings: `on_overview_name_changed` and form field signals route to internal edit/update callbacks in `vmmDetails`
  - edit CPU/memory/boot: details UI field changes and `vmmDetails` callback handlers update the VM device model
  - add hardware: `vmmDetails` opens `vmmAddHardware` and connects to `vmmAddHardware` signals for device type and validation
  - remove hardware: details UI remove action triggers `vmmDetails` remove handling and device cleanup
  - edit storage: details UI storage edit triggers `vmmDetails` and `vmmAddStorage` flows
  - open network source: network button opens `vmmNetworkList`
  - open graphics settings: graphics button opens `vmmGraphicsDetails`
  - open TPM settings: TPM button opens `vmmTPMDetails`
  - open VSOCK settings: VSOCK button opens `vmmVsockDetails`
  - launch XML editor: details action opens `vmmXMLEditor`
  - launch storage browser: details action opens `vmmStorageBrowser`
  - launch OS list: details action opens `vmmOSList`
  - apply changes: details apply button commits device and domain updates through `vmmDetails`

## Scope

- Details container, tab structure, property editing, device dialogs, and live VM detail refresh behavior.

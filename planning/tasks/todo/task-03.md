# Task 03 - vm-details

## Metadata

- Status: todo
- Verify: 0%
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
- Action Flows:
  - - Actions:: <signal/click source> -> - Flow Classes: -> <helper/service class>
	- open
	- refresh
	- select hardware
	- edit general settings
	- edit CPU
	- edit memory
	- edit boot
	- add hardware
	- remove hardware
	- edit storage
	- edit network
	- edit graphics
	- edit TPM
	- edit VSOCK
	- launch XML editor
	- launch storage browser
	- launch OS list
	- apply changes

## Scope

- Details container, tab structure, property editing, and live refresh behavior.

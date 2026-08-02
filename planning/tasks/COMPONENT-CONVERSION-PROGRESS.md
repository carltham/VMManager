# Component Conversion Progress (Source-Verified)

Baseline source for comparison:
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/virtManager
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/virtManager/device
- /mnt/DATA/Projects/0.present-projects/Active/virt-manager/ui

Last verification run:
- Backend: ./mvnw -q test (pass)
- Frontend: npm run build (pass)

## Rules for 100%
- Conversion is 100% only when every component in this scope has:
  - original Python + UI source identified
  - Spring backend module (Dto/Service/Controller)
  - Angular module (models/api/component)
  - shell integration in app.html/app.ts
- Fully verified is 100% only when conversion is complete AND each component passes a Playwright test against the original Python virt-manager component flow.

## Progress Bars
- Conversion Progress: [####################] 100% (15/15)
- Fully Verified Progress: [....................] 0% (0/15)

## Scope and Status (Tasks 01-15)

| Component | Original Python | Original UI | Backend Module | Angular Module | Shell Wired | Fully Verified |
|---|---|---|---|---|---|---|
| manager | virtManager/manager.py | ui/manager.ui | yes | yes | yes | no |
| vm-window | virtManager/vmwindow.py | ui/vmwindow.ui | yes | yes | yes | no |
| vm-details | virtManager/details/details.py | ui/details.ui | yes | yes | yes | no |
| create-vm | virtManager/createvm.py | ui/createvm.ui | yes | yes | yes | no |
| clone-vm | virtManager/clone.py | ui/clone.ui | yes | yes | yes | no |
| delete-vm | virtManager/delete.py | ui/delete.ui | yes | yes | yes | no |
| migrate-vm | virtManager/migrate.py | ui/migrate.ui | yes | yes | yes | no |
| add-hardware | virtManager/addhardware.py | ui/addhardware.ui | yes | yes | yes | no |
| add-storage | virtManager/device/addstorage.py | ui/addstorage.ui | yes | yes | yes | no |
| filesystem-details | virtManager/device/fsdetails.py | ui/fsdetails.ui | yes | yes | yes | no |
| graphics-details | virtManager/device/gfxdetails.py | ui/gfxdetails.ui | yes | yes | yes | no |
| tpm-details | virtManager/device/tpmdetails.py | ui/tpmdetails.ui | yes | yes | yes | no |
| vsock-details | virtManager/device/vsockdetails.py | ui/vsockdetails.ui | yes | yes | yes | no |
| create-network | virtManager/createnet.py | ui/createnet.ui | yes | yes | yes | no |
| network-list | virtManager/device/netlist.py | ui/netlist.ui | yes | yes | yes | no |

## Notes
- Task 32 libvirt boundary matrix documented in planning/JAVA-LIBVIRT-BACKEND-PLAN.md (classification only; Verify 0%).
- Tasks 21-31 tools web evidence: `tools.spec.mjs` 6/6 passed; Verify stays 0%.
- Tasks 17-20 storage web evidence: `network-storage.spec.mjs` 4/4 passed (pool/volume/browse/host-storage); Verify stays 0%.
- Comparison is based on actual files in /mnt/DATA/Projects/0.present-projects/Active/virt-manager/, not task markdown definitions.
- Angular Playwright coverage demonstrates web implementation behavior only; it does not count as verification until equivalent reference-side Playwright coverage exists for Python virt-manager.
- Angular modules and shell wiring exist for tasks 01-15. Fully Verified stays 0% until Python virt-manager reference Playwright exists. Angular Playwright is web implementation evidence only.

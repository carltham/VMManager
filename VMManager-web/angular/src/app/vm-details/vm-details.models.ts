import { VmItem } from '../manager/manager.models';

export interface VmDetailsView {
  vm: VmItem;
  open: boolean;
  selectedHardware: string;
  generalSettings: string;
  cpuCount: number;
  memoryMb: number;
  bootOrder: string;
  hardwareDevices: string[];
  xmlEditorOpen: boolean;
  storageBrowserOpen: boolean;
  osListOpen: boolean;
  statusMessage: string;
}

import { VmItem } from '../manager/manager.models';
import { VmWindowView } from '../vm-window/vm-window.models';

export interface ConsoleView {
  vms: VmItem[];
  selectedVmId: number | null;
  window: VmWindowView | null;
  statusMessage: string;
  errorMessage: string;
}

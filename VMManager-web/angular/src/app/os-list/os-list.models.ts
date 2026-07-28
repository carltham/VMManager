import { VmItem } from '../manager/manager.models';

export interface OsListView {
  vms: VmItem[];
  selectedVmId: number | null;
  osChoices: string[];
  selectedOs: string;
  osListOpen: boolean;
  statusMessage: string;
  errorMessage: string;
}

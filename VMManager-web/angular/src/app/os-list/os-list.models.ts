import { VmItem } from '../manager/manager.models';

export interface OsListView {
  vms: VmItem[];
  selectedVmId: number | null;
  query: string;
  osChoices: OsChoice[];
  selectedOsId: string;
  osListOpen: boolean;
  statusMessage: string;
  errorMessage: string;
}

export interface OsChoice {
  id: string;
  label: string;
  family: string;
}

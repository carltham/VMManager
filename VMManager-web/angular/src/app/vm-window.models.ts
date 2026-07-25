import { VmItem } from './manager.models';

export type VmWindowTab = 'CONSOLE' | 'DETAILS';

export interface VmWindowView {
  vm: VmItem;
  activeTab: VmWindowTab;
  statusMessage: string;
  consoleText: string;
  detailsText: string;
}

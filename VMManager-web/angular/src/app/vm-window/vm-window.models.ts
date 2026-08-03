import { VmItem } from '../manager/manager.models';

export type VmWindowTab = 'CONSOLE' | 'DETAILS';

export interface VmWindowView {
  vm: VmItem;
  activeTab: VmWindowTab;
  statusMessage: string;
  consoleText: string;
  detailsText: string;
  consoleConnected: boolean;
  viewerType: string;
  fullscreen: boolean;
  keyboardGrabbed: boolean;
}

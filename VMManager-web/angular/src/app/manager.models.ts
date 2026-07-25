export type VmState = 'RUNNING' | 'PAUSED' | 'SHUTOFF';

export interface VmItem {
  id: number;
  connectionId: number;
  name: string;
  state: VmState;
  opened: boolean;
}

export interface ConnectionItem {
  id: number;
  name: string;
  uri: string;
  vms: VmItem[];
}

export interface ManagerOverview {
  statsEnabled: boolean;
  connections: ConnectionItem[];
}

export interface ActionResult {
  action: string;
  message: string;
}

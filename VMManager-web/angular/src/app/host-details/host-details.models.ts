import { ConnectionItem } from '../manager/manager.models';

export interface HostDetailsData {
  connectionId: number;
  connectionName: string;
  uri: string;
  autoConnect: boolean;
  cpuUsage: number;
  memoryUsageMb: number;
  vmCount: number;
}

export interface HostAutoconnectUpdate {
  connectionId: number;
  autoConnect: boolean;
  statusMessage: string;
}

export interface HostDetailsView {
  connections: ConnectionItem[];
  selectedConnectionId: number | null;
  details: HostDetailsData | null;
  autoConnectEnabled: boolean;
  statusMessage: string;
  errorMessage: string;
}

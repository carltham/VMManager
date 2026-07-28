import { ConnectionItem } from '../manager/manager.models';

export interface HostDetailsData {
  connectionId: number;
  connectionName: string;
  uri: string;
  cpuUsage: number;
  memoryUsageMb: number;
  vmCount: number;
}

export interface HostDetailsView {
  connections: ConnectionItem[];
  selectedConnectionId: number | null;
  details: HostDetailsData | null;
  statusMessage: string;
  errorMessage: string;
}

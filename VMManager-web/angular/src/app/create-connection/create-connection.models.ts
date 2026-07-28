import { ConnectionItem } from '../manager/manager.models';

export interface CreateConnectionView {
  name: string;
  uri: string;
  connections: ConnectionItem[];
  statusMessage: string;
  errorMessage: string;
  submitting: boolean;
}

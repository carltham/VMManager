import { VmItem } from '../manager/manager.models';

export interface SnapshotItem {
  id: number;
  name: string;
  createdAt: string;
}

export interface SnapshotsView {
  vms: VmItem[];
  selectedVmId: number | null;
  snapshots: SnapshotItem[];
  selectedSnapshotId: number | null;
  statusMessage: string;
  errorMessage: string;
}

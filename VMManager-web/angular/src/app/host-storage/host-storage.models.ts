export interface HostStoragePool {
  id: number;
  name: string;
  target: string;
  active: boolean;
}

export interface HostStorageVolume {
  id: number;
  name: string;
  pool: string;
  format: string;
  sizeGb: number;
}

export interface HostStorageView {
  open: boolean;
  pools: HostStoragePool[];
  volumes: HostStorageVolume[];
  statusMessage: string;
  errorMessage: string;
}

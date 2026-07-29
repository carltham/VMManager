export interface StoragePoolItem {
  id: number;
  name: string;
  type: string;
  target: string;
  active: boolean;
}

export interface StorageVolumeItem {
  id: number;
  name: string;
  pool: string;
  format: string;
  sizeGb: number;
}

export interface StorageManagementView {
  pools: StoragePoolItem[];
  volumes: StorageVolumeItem[];
  currentPath: string;
}

export interface StoragePoolCreateRequest {
  name: string;
  type: string;
  target: string;
}

export interface StorageVolumeCreateRequest {
  name: string;
  pool: string;
  format: string;
  sizeGb: number;
}

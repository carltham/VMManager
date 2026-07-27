export interface CreateVolumeView {
  open: boolean;
  name: string;
  pool: string;
  format: string;
  sizeGb: number;
  path: string;
  pools: string[];
  statusMessage: string;
  errorMessage: string;
}

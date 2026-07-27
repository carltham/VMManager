export interface MigrateVmDialogView {
  dialogId: number;
  open: boolean;
  vmId: number | null;
  destination: string;
  addressEnabled: boolean;
  portEnabled: boolean;
  migrationMode: string;
  xmlPreview: string;
  statusMessage: string;
}
export interface AddHardwareDialogView {
  dialogId: number;
  open: boolean;
  vmId: number | null;
  deviceType: string;
  configuration: string;
  valid: boolean;
  statusMessage: string;
}
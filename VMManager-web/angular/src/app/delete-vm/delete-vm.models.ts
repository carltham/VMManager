export interface DeleteVmDialogView {
  dialogId: number;
  open: boolean;
  vmId: number | null;
  removeStorage: boolean;
  statusMessage: string;
}
export interface CloneSourceVmOption {
  id: number;
  connectionId: number;
  name: string;
  state: string;
}

export interface CloneVmDialogView {
  dialogId: number;
  open: boolean;
  sourceVmId: number | null;
  availableSourceVms: CloneSourceVmOption[];
  cloneMode: string;
  destinationPath: string;
  diskOptions: string;
  cloneName: string;
  statusMessage: string;
}

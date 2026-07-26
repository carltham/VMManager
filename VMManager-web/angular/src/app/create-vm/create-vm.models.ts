export interface CreateVmWizardView {
  wizardId: number;
  open: boolean;
  step: number;
  connectionId: number;
  availableConnections: string[];
  installMethod: string;
  vmName: string;
  isoPath: string;
  url: string;
  importSource: string;
  appSource: string;
  osContainerSource: string;
  detectOs: boolean;
  storageEnabled: boolean;
  arch: string;
  type: string;
  machine: string;
  statusMessage: string;
}

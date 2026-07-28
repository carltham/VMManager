import { VmItem } from '../manager/manager.models';

export interface XmlEditorView {
  vms: VmItem[];
  selectedVmId: number | null;
  xmlText: string;
  editorOpen: boolean;
  statusMessage: string;
  errorMessage: string;
}

export interface StorageBrowseView {
  open: boolean;
  currentPath: string;
  entries: string[];
  selectedPath: string;
  statusMessage: string;
  errorMessage: string;
}

export interface CreatePoolView {
  open: boolean;
  name: string;
  type: string;
  source: string;
  target: string;
  types: string[];
  statusMessage: string;
  errorMessage: string;
}

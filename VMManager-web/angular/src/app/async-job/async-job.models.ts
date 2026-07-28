export interface AsyncJobView {
  isRunning: boolean;
  progress: number;
  statusMessage: string;
  errorMessage: string;
}

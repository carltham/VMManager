export interface ConnectionAuthView {
  connectionId: number;
  username: string;
  password: string;
  remember: boolean;
  statusMessage: string;
  errorMessage: string;
  isSubmitting: boolean;
}

export interface ConnectionAuthResult {
  success: boolean;
  message: string;
  sessionId?: string;
  expiresAt?: string;
}

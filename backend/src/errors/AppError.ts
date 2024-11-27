type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_PROCEEDING_PARTICIPANT'
  | 'FILE_NOT_FOUND'
  | 'SERVER_ERROR';

const defaultErrorMessages: Record<ErrorCode, string> = {
  UNAUTHENTICATED: 'You must be authenticated to access this resource.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_PROCEEDING_PARTICIPANT: 'User is not a participant in this proceeding.',
  FILE_NOT_FOUND: 'The specified file was not found.',
  SERVER_ERROR:
    'An unexpected error occurred on the server. Please try again later.',
};

export class AppError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? defaultErrorMessages[code]);
    this.code = code;
  }
}

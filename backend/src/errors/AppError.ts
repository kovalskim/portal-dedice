type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_PROCEEDING_PARTICIPANT'
  | 'FILE_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NOT_FOUND'
  | 'DELETE_PARTICIPANT_ERROR'
  | 'INVALID_TOKEN'
  | 'VERIFICATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'ALREADY_EXISTING'
  | 'DELETE_ERROR'
  | 'NOT_SUPPORTED'
  | 'CRITERIA_ERROR';

const defaultErrorMessages: Record<ErrorCode, string> = {
  UNAUTHENTICATED: 'You must be authenticated to access this resource.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  NOT_PROCEEDING_PARTICIPANT: 'User is not a participant in this proceeding.',
  FILE_NOT_FOUND: 'The specified file was not found.',
  SERVER_ERROR:
    'An unexpected error occurred on the server. Please try again later.',
  NOT_FOUND: 'Not found.',
  DELETE_PARTICIPANT_ERROR: 'Participant was not deleted',
  INVALID_TOKEN: 'Invalid token',
  VERIFICATION_ERROR: 'Not verified',
  VALIDATION_ERROR: 'Invalid input',
  ALREADY_EXISTING: 'Already existing',
  DELETE_ERROR: 'Error during deletion process occurred',
  NOT_SUPPORTED: 'Not supported',
  CRITERIA_ERROR: 'Proceeding input does not meet notary criteria',
};

export class AppError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? defaultErrorMessages[code]);
    this.code = code;
  }
}

import { GraphQLError } from 'graphql/error';

export function notFoundError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

export function unauthorizedError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

export function validationError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'BAD_USER_INPUT' },
  });
}

export function existingError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'EXISTING' },
  });
}

export function verificationError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_VERIFIED' },
  });
}

export function courtNotFoundError(message: string) {
  return new GraphQLError(message, {
    extensions: {
      code: 'COURT_NOT_FOUND',
    },
  });
}

export function unauthenticatedError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHENTICATED' },
  });
}

export function serverError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  });
}

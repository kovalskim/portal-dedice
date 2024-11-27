import { createMethodMiddlewareDecorator } from 'type-graphql';

import { AppError } from '@backend/errors/AppError';
import { CustomContext } from '@backend/types/types';

export type AuthenticatedContext = Omit<CustomContext, 'authUser'> & {
  authUser: NonNullable<CustomContext['authUser']>;
};

export const Authenticated = (): MethodDecorator => {
  return createMethodMiddlewareDecorator<CustomContext>(
    async ({ context }, next) => {
      if (!context.authUser) {
        throw new AppError('UNAUTHENTICATED');
      }

      (context as AuthenticatedContext).authUser = context.authUser;

      return next();
    },
  );
};

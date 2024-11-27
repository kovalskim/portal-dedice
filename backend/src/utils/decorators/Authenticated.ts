import { createMethodMiddlewareDecorator } from 'type-graphql';

import { unauthenticatedError } from '@backend/graphql/errors';
import { CustomContext } from '@backend/types/types';

export type AuthenticatedContext = Omit<CustomContext, 'authUser'> & {
  authUser: NonNullable<CustomContext['authUser']>;
};

export const Authenticated = (): MethodDecorator => {
  return createMethodMiddlewareDecorator<CustomContext>(
    async ({ context }, next) => {
      if (!context.authUser) {
        throw unauthenticatedError('Unauthenticated');
      }

      (context as AuthenticatedContext).authUser = context.authUser;

      return next();
    },
  );
};

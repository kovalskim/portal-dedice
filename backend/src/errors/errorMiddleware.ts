import { GraphQLError } from 'graphql';
import { IMiddleware } from 'graphql-middleware';

import { AppError } from '@backend/errors/AppError';

export const errorMiddleware: IMiddleware = async (
  resolve,
  root,
  args,
  context,
  info,
) => {
  try {
    return await resolve(root, args, context, info);
  } catch (error) {
    if (error instanceof AppError) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
        },
      });
    }
    console.error(error);
    throw new GraphQLError('Internal server error');
  }
};

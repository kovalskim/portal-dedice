import * as fs from 'fs/promises';
import { GraphQLError } from 'graphql';
import { IMiddleware } from 'graphql-middleware';
import path from 'path';

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
    const errorMessage = `[${new Date().toISOString()}] ${error}\n`;

    try {
      const logFilePath = path.join(__dirname, '../../tmp/errors.log');
      await fs.appendFile(logFilePath, errorMessage, 'utf-8');
    } catch (fileError) {
      console.error('Failed to write to log file:', fileError);
    }

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

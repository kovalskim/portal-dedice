import jwt, { JwtPayload } from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { JWTPayload, ParticipantInvitationJWTPayload } from '../types/types';

export const createToken = (content: string | object): string => {
  return jwt.sign(content, JWT_SECRET);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

export const parseAndVerifyJWT = (token: string): JWTPayload | null => {
  if (!token) {
    return null;
  }
  try {
    const payload = verifyToken(token) as JWTPayload;
    return payload;
  } catch (err) {
    return null;
  }
};

export const parseAndVerifyParticipationInvitationJWT = (
  token: string,
): ParticipantInvitationJWTPayload | null => {
  if (!token) {
    return null;
  }
  try {
    const payload = verifyToken(token) as ParticipantInvitationJWTPayload;
    return payload;
  } catch (err) {
    return null;
  }
};

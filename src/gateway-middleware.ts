import JWT from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import { NotAuthorizeError } from './error-handler';

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export function verifyGatewayREquest(req: Request, res: Response, next: NextFunction) : void {

  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizeError('Invalid request!', 'The request is not coming from API gateway!')
  };

  const token : string = req.headers?.gatewaytoken as string;

  if (!token) {
    throw new NotAuthorizeError('Invalid request!', 'The request is not coming from API gateway!')
  };

  try {
    const payload: {id: string, iat: number} = JWT.verify(token, 'b6b97001cb1d3beb25f1d9726c7546e2') as {id: string, iat: number};

    if(!tokens.includes(payload.id)) {
      throw new NotAuthorizeError('Invalid request!', 'The request has an invalid payload!');
    }
  } catch (error) {
      throw new NotAuthorizeError('Invalid request!', 'The request is not coming from API gateway!')
  };
  next();
}

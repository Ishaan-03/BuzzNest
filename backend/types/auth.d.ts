// types.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      email: string;
      username: string;
    };
  }
}

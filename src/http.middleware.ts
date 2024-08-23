import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CONFIG } from './config';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (process.env.USE_NGINX !== '1') {
      res.set({ 'Strict-Transport-Security': 'max-age=31536000' });
      // if (!CONFIG.IS_DEV) {
      //   console.log(
      //     `request ${req.protocol}://${req.hostname}${req.originalUrl}`,
      //     req.method,
      //     req.ip,
      //     req.headers['user-agent'],
      //   );
      // }

      if (req.hostname !== CONFIG.HOST) {
        res.send(HttpStatus.FORBIDDEN);
        return;
      }
      if (req.protocol === 'http') {
        res.redirect(
          HttpStatus.PERMANENT_REDIRECT,
          `https://${req.hostname}${req.originalUrl}`,
        );
        return;
      }
    }
    next();
  }
}

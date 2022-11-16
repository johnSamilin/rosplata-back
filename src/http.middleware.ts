import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    res.set({ 'Strict-Transport-Security': 'max-age=31536000' });
    console.log(`request ${req.protocol}://${req.hostname}${req.originalUrl}`);
    if (req.protocol === 'http') {
      res.redirect(HttpStatus.PERMANENT_REDIRECT, `https://${req.originalUrl}`)
      return;
    }
    next();
  }
}

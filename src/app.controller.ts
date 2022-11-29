import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { CONFIG } from './config';

import path = require('path');

@Controller()
export class AppController {
  constructor() {}

  @Get('.well-known/acme-challenge/:key')
  letsencrypt(@Param('key') key) {
    return `${key}.${CONFIG.LE_TOKEN}`;
  }

  @Get('*')
  notfound(@Req() req: Request, @Res() res: Response): void {
    res.sendFile(path.resolve('./rosplata/_index.html'));
  }
}

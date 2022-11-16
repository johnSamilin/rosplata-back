import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { CONFIG } from './config';

import path = require('path');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('.well-known/acme-challenge/:key')
  letsencrypt(@Param('key') key) {
    return `${key}.${CONFIG.LE_TOKEN}`;
  }

  @Get('api/*')
  getApi(): string {
    return 'hi';
  }

  @Get('*')
  getHello(@Res() res: Response): void {
    res.sendFile(path.resolve('./rosplata/_index.html'));
  }
}

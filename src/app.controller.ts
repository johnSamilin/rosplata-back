import {
  Controller,
  Post,
  Patch,
  Put,
  Delete,
  Get,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
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

  @Get('/api/*')
  stubGet(@Res() res: Response) {
    res.send(HttpStatus.NOT_FOUND);
  }
  
  @Post('/api/*')
  stubPost(@Res() res: Response) {
    res.send(HttpStatus.NOT_FOUND);
  }
  
  @Patch('/api/*')
  stubPatch(@Res() res: Response) {
    res.send(HttpStatus.NOT_FOUND);
  }
  
  @Put('/api/*')
  stubPut(@Res() res: Response) {
    res.send(HttpStatus.NOT_FOUND);
  }
  
  @Delete('/api/*')
  stubDelete(@Res() res: Response) {
    res.send(HttpStatus.NOT_FOUND);
  }

  @Get('*')
  notfound(@Req() req: Request, @Res() res: Response): void {
    res.sendFile(path.resolve('./rosplata/_index.html'));
  }
}

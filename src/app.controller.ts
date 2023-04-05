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

const supportedLangs = ['ar', 'es', 'fr', 'ko', 'ru', 'zh', 'hi', 'bn', 'he'];

@Controller()
export class AppController {
  constructor() { }

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

  @Post('/lang/:code')
  changeLang(@Param() param, @Res() res: Response) {
    if (supportedLangs.includes(param.code)) {
      res.cookie('lang', param.code, {
        expires: new Date(new Date().getTime() + 3600 * 1000),
        sameSite: 'strict',
        httpOnly: true,
      });
    }
    res.send();
  }

  @Get('*')
  notfound(@Req() req: Request, @Res() res: Response): void {
    let preferredLang;
    const cookieLang = req.cookies.lang;
    if (cookieLang && supportedLangs.includes(cookieLang)) {
      preferredLang = cookieLang;
    } else {
      const langs = req.headers['accept-language']
        ?.split(',')
        .map((lang) => lang.split(';')[0]);

      preferredLang = langs.find((lang) =>
        supportedLangs.includes(lang.split('-')[0]),
      );
    }
    res.sendFile(
      path.resolve(
        preferredLang
          ? `./rosplata/translations/generated/${preferredLang}.html`
          : './rosplata/_index.html',
      ),
    );
  }
}

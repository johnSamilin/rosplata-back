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
import { supportedLangs } from './langs';

import path = require('path');
import { StatsService } from './stats/stats.service';

const fs = require('fs');

@Controller()
export class AppController {
  constructor(private statsService: StatsService) { }
  
  @Get('version')
  version(@Res() res: Response) {
    const pack = JSON.parse(fs.readFileSync('./package.json').toString());
    res.json({ version: pack.version });
  }

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

  @Get('about')
  about(@Res() res: Response) {
    res.sendFile(path.resolve('./rosplata/about.html'));
  }

  @Get('*')
  notfound(@Req() req: Request, @Res() res: Response): void {
    let preferredLang;
    const cookieLang = req.cookies.lang;
    const amIKnowYou = 'amIKnowYou' in req.cookies;
    if (cookieLang && supportedLangs.includes(cookieLang)) {
      preferredLang = cookieLang;
    } else {
      const langs = req.headers['accept-language']
        ?.split(',')
        .map((lang) => lang.split(';')[0])
        .map((lang) => lang.split('-')[0]);

      preferredLang = langs?.find((lang) => supportedLangs.includes(lang));
    }

    if (!amIKnowYou) {
      this.statsService.log('lang', req.headers['accept-language']);
      this.statsService.log('useragent', req.headers['user-agent']);
      res.cookie('amIKnowYou', 'ofCourseYouDo', {
        expires: new Date(new Date().getTime() + 365 * 24 * 3600 * 1000),
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
      });
    }

    res.sendFile(
      path.resolve(
        preferredLang && preferredLang !== 'en'
          ? `./rosplata/translations/generated/${preferredLang}.html`
          : './rosplata/_index.html',
      ),
    );
  }
}

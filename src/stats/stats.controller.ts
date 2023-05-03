import { Controller, Get, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Response } from 'express';
import * as uap from 'ua-parser-js';

@Controller('api/stats')
export class StatsController {
  constructor(private statsService: StatsService) { }

  @Get('')
  async all(@Res() res: Response) {
    const [langs, uas] = await Promise.all([
      this.statsService.getLangs(),
      this.statsService.getUa(),
    ]);

    const langsMap = {};
    const uasMap = {
      os: {},
      browser: {},
    };

    langs.forEach((rawLangs) => {
      const lang = rawLangs.value.split(',')[0];
      if (!(lang in langsMap)) {
        langsMap[lang] = 0;
      }
      langsMap[lang] += 1;
    });
    uas.forEach((rawUa) => {
      const ua = uap(rawUa.value);
      const bName = ua.browser.name;
      const bVer = ua.browser.version || 'unknown version';
      const osName = ua.os.name;
      const osVer = ua.os.major || 'unknown version';
      if (bName) {
        if (!(bName in uasMap.browser)) {
          uasMap.browser[bName] = {};
        }
        if (!(bVer in uasMap.browser[bName])) {
          uasMap.browser[bName][bVer] = 0;
        }
        uasMap.browser[bName][bVer] += 1;
      }
      if (osName) {
        if (!(osName in uasMap.os)) {
          uasMap.os[osName] = {};
        }
        if (!(osVer in uasMap.os[osName])) {
          uasMap.os[osName][osVer] = 0;
        }
        uasMap.os[osName][osVer] += 1;
      }
    });

    res.send({ langsMap, uasMap });
  }
}

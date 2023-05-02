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
      if (!(ua.browser.name in uasMap.browser)) {
        uasMap.browser[ua.browser.name] = {};
      }
      if (!(ua.browser.version in uasMap.browser[ua.browser.name])) {
        uasMap.browser[ua.browser.name][ua.browser.version] = 0;
      }
      if (!(ua.os.name in uasMap.os)) {
        uasMap.os[ua.os.name] = {};
      }
      if (!(ua.os.version in uasMap.os[ua.os.name])) {
        uasMap.os[ua.os.name][ua.os.version] = 0;
      }
      uasMap.browser[ua.browser.name][ua.browser.version] += 1;
      uasMap.os[ua.os.name][ua.os.version] += 1;
    });

    res.send({ langsMap, uasMap });
  }
}

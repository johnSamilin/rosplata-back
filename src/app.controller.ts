import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { CONFIG } from './config';

import path = require('path');

function mapResourceToPreloadLink(res) {
  let as = 'script';
  let rel = 'modulepreload';
  if (res.endsWith('.css')) {
    as = 'style';
    rel = 'preload';
  }
  return `<${res}>; rel="${rel}"; as="${as}"`;
}

const commonPreloadMap = [
  '/src/constants/routes.mjs',
  '/src/utils/imports.js',
  '/src/utils/utils.mjs',
  '/src/core/FeatureDetector.mjs',
  '/src/core/Router.mjs',
  '/src/core/Store.mjs',
  '/src/core/Component.mjs',
  '/src/core/SettingsManager.mjs',
  '/src/App.mjs',
  '/src/core/LayoutManager.mjs',
];

const preloadMap = {
  '/': [
    '/src/layouts/Main/MainLayout.mjs',
    '/src/layouts/Main/MainLayout.css',
    '/src/containers/BudgetList/BudgetList.mjs',
    '/src/containers/BudgetList/BudgetList.css',
    '/src/containers/BudgetListItem/BudgetListItem.mjs',
    '/src/containers/BudgetListItem/BudgetListItem.css',
  ],
  '/settings': [
    '/src/layouts/Settings/SettingsLayout.mjs',
    '/src/layouts/Settings/SettingsLayout.css',
    '/src/core/SettingsManager.mjs',
    '/src/containers/Menu/Menu.mjs',
    '/src/containers/Menu/Menu.css',
    '/src/containers/Settings/Settings.mjs',
    '/src/containers/Settings/Settings.css',
  ],
  '/settings/features': [
    '/src/layouts/Settings/SettingsLayout.mjs',
    '/src/layouts/Settings/SettingsLayout.css',
    '/src/core/SettingsManager.mjs',
    '/src/containers/Menu/Menu.mjs',
    '/src/containers/Menu/Menu.css',
    '/src/containers/Features/Features.mjs',
    '/src/containers/Features/Features.css',
  ],
};

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
  getHello(@Res() res: Response, @Req() req: Request): void {
    // console.log(req.url)
    if (req.url in preloadMap) {
      res.set({
        Link: commonPreloadMap
          .concat(preloadMap[req.url])
          .map(mapResourceToPreloadLink)
          .join(', '),
      });
    }
    res.sendFile(path.resolve('./rosplata/_index.html'));
  }
}

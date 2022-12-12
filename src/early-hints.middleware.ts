import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

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
  '/src/core/RequestManager.mjs',
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
  '/create': [
    '/src/layouts/Main/MainLayout.mjs',
    '/src/layouts/Main/MainLayout.css',
    '/src/containers/BudgetList/BudgetList.mjs',
    '/src/containers/BudgetList/BudgetList.css',
    '/src/containers/BudgetListItem/BudgetListItem.mjs',
    '/src/containers/BudgetListItem/BudgetListItem.css',
    '/src/containers/NewBudget/NewBudget.mjs',
    '/src/containers/NewBudget/NewBudget.css',
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

@Injectable()
export class EarlyHintsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.url in preloadMap) {
      res.set({
        Link: commonPreloadMap
          .concat(preloadMap[req.url])
          .map(mapResourceToPreloadLink)
          .join(', '),
      });
    }
    next();
  }
}

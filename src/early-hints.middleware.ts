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
  '/src/core/ListComponent.mjs',
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js',
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
  '/budgets/\\d+': [
    '/src/layouts/Main/MainLayout.mjs',
    '/src/layouts/Main/MainLayout.css',
    '/src/constants/userStatuses.mjs',
    '/src/containers/BudgetList/BudgetList.mjs',
    '/src/containers/BudgetList/BudgetList.css',
    '/src/containers/BudgetListItem/BudgetListItem.mjs',
    '/src/containers/BudgetListItem/BudgetListItem.css',
    '/src/containers/TransactionsList/TransactionsList.mjs',
    '/src/containers/TransactionsList/TransactionsList.css',
    '/src/containers/TransactionsListItem/TransactionsListItem.mjs',
    '/src/containers/TransactionsListItem/TransactionsListItem.css',
    '/src/containers/ParticipantsList/ParticipantsList.mjs',
    '/src/containers/ParticipantsList/ParticipantsList.css',
    '/src/containers/ParticipantsListItem/ParticipantsListItem.mjs',
    '/src/containers/ParticipantsListItem/ParticipantsListItem.css',
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

const preloadPatterns = Object.keys(preloadMap);

@Injectable()
export class EarlyHintsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const key = preloadPatterns.find((k) =>
      req.baseUrl.match(new RegExp(`^${k}$`)),
    );

    if (key in preloadMap) {
      res.set({
        Link: commonPreloadMap
          .concat(preloadMap[key])
          .map(mapResourceToPreloadLink)
          .join(', '),
      });
    }
    next();
  }
}

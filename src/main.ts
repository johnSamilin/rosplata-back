import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import { Express } from 'express';
import { join } from 'path';
import { Server, ServerOptions, createServer } from 'spdy';
import { AppModule } from './app.module';

import express = require('express');
import fs = require('fs');
import { CONFIG } from './config';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const expressApp: Express = express();
  let server: Server;
  if (process.env.USE_NGINX !== '1') {
    const spdyOpts: ServerOptions = {
      key: fs.readFileSync(CONFIG.IS_DEV ? './test.key' : './privkey.pem'),
      cert: fs.readFileSync(CONFIG.IS_DEV ? './test.crt' : './fullchain.pem'),
    };
    server = createServer(spdyOpts, expressApp);
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useStaticAssets(join(__dirname, '..', 'rosplata'));
  app.use(cookieParser());

  await app.init();
  if (process.env.USE_NGINX !== '1') {
    await server.listen(process.env.HTTPS_PORT || 443);
  }
  await app.listen(process.env.HTTP_PORT || 80);
}
bootstrap();

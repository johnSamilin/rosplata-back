import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import { Express } from 'express';
import { join } from 'path';
import { Server, ServerOptions, createServer } from 'spdy';
import { AppModule } from './app.module';

import express = require('express');
import fs = require('fs');

async function bootstrap() {
  const expressApp: Express = express();
  const spdyOpts: ServerOptions = {
    key: fs.readFileSync('./test.key'),
    cert: fs.readFileSync('./test.crt'),
  };
  const server: Server = createServer(spdyOpts, expressApp);

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useStaticAssets(join(__dirname, '..', 'rosplata'));

  await app.init();
  await server.listen(process.env.PORT || 443);

}
bootstrap();

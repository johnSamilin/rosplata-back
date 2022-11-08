import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

import path = require('path');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/api/*')
  getApi(): string {
    return 'hi'
  }

  @Get('*')
  getHello(@Res() res: Response): void {
    res.sendFile(path.resolve('./public/index.html'))
    //@ts-ignore
    const stream = res.push(
      './public/src/containers/BudgetListItem/BudgetListItem.mjs',
      {
        status: 200, // optional
        method: 'GET', // optional
        request: {
          accept: '*/*'
        },
        response: {
          'content-type': 'application/javascript'
        }
      }
    )
    stream.on('error', (...args) => {
      console.error(args)
    })
    stream.end('')
  }
}

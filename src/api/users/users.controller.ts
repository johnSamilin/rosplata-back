import {
  Controller,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { supportedLangs } from 'src/langs';

@Controller('api/users')
@UseGuards(AuthGuard('firebase'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('validate')
  async auth(@Res() res: Response, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;
    try {
      await this.usersService.upsert(
        user.uid,
        user.name,
        user.email,
        user.picture,
      );
    } catch (er) {
      console.error('Error while upserting user', er);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'Error while upserting user' });
      return;
    }
    return res.status(HttpStatus.OK).send({});
  }
  
  @Post('lang/:code')
  async changeLang(@Param() param, @Res() res: Response, @Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    if (supportedLangs.includes(param.code)) {
      if (user) {
        await this.usersService.changeLang(user.uid, param.code);
      }
      res.cookie('lang', param.code, {
        expires: new Date(new Date().getTime() + 30 * 24 * 3600 * 1000),
        sameSite: 'strict',
        httpOnly: true,
        path: '/',
      });
    } else if (param.code === 'system') {
      if (user) {
        await this.usersService.changeLang(user.uid, param.code);
      }
      res.cookie('lang', 'system', {
        expires: new Date(),
        path: '/',
      });
    }
    res.send({ ok: true });
  }
}

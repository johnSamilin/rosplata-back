import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  Req,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { BudgetsService } from './budgets.service';

@Controller('api/budgets')
@UseGuards(AuthGuard('firebase'))
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get('')
  async list(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;
    return await this.budgetsService.getAll(user.uid);
  }

  @Get(':id')
  async findOne(@Param('id') id, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;
    return await this.budgetsService.get(id, user.uid);
  }

  @Put('')
  @UseInterceptors(FileInterceptor('body'))
  async create(@Body() body, @Res() res: Response, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;
    if (
      !body.name ||
      body.name.length < 3 ||
      body.name.length > 20 ||
      /([^\w\d ]+)/gi.test(body.name)
    ) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }
    await this.budgetsService.create(body.name, user.uid);

    res.status(HttpStatus.CREATED).send({ created: true });
  }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { BudgetsService } from './budgets.service';

@Controller('api/budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get('')
  async list() {
    return await this.budgetsService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.budgetsService.get(id);
  }

  @Put('')
  @UseInterceptors(FileInterceptor('body'))
  async create(@Body() body, @Res() res: Response) {
    if (
      !body.name ||
      body.name.length < 3 ||
      body.name.length > 20 ||
      /([^\w\d ]+)/gi.test(body.name)
    ) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }
    await this.budgetsService.create(body.name);

    res.status(HttpStatus.CREATED).send({ created: true });
  }
}

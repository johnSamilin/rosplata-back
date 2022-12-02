import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
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

  @Post('')
  async create(@Body() body, @Res() res: Response) {
    console.log({ body });

    if (!body.name) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }
    return await this.budgetsService.create(body.name);
  }
}

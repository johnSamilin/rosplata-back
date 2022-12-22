import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { TransactionsService } from './transactions.service';

@Controller('api/transactions')
@UseGuards(AuthGuard('firebase'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get(':budgetId')
  async findAllByBudget(@Param('budgetId') budgetId) {
    return await this.transactionsService.getAllByBudget(budgetId);
  }

  @Post('')
  async create(@Body() body, @Res() res: Response, @Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = req.user;
    const amount = parseFloat(body.amount);
    const budgetId = parseInt(body.budgetId);
    if (amount <= 0) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Amount should be greater than 0');
      return;
    }
    if (budgetId <= 0) {
      res.status(HttpStatus.BAD_REQUEST).send('Budget id should be specified');
      return;
    }
    const transaction = await this.transactionsService.create(
      budgetId,
      user.uid,
      amount,
    );

    res.status(HttpStatus.CREATED).send({ id: transaction.id });
  }
}

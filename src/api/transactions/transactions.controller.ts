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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { filterXSS } from 'xss';
import { TransactionsService } from './transactions.service';

@Controller('api/transactions')
@UseGuards(AuthGuard('firebase'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get(':budgetId')
  async findAllByBudget(@Param('budgetId') budgetId, @Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    return await this.transactionsService.getAllByBudget(budgetId, user.uid);
  }

  @Post('')
  @UseInterceptors(FileInterceptor('body'))
  async create(@Body() body, @Res() res: Response, @Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    const amount = parseFloat(body.amount);
    const budgetId = body.budgetId;

    if (amount <= 0) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('Amount should be greater than 0');
      return;
    }
    if (budgetId <= 0) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: 'Budget id should be specified' });
      return;
    }
    try {
      const transaction = await this.transactionsService.create(
        body.id,
        budgetId,
        user.uid,
        amount,
        body.currency,
        filterXSS(body.comment),
      );
      res.status(HttpStatus.CREATED).send({ id: transaction.id });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send({ error: error.message });
    }
  }
}

import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transactions } from '../models/Transactions';
import { Participants } from '../models/Participants';
import { Budgets } from '../models/Budgets';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [SequelizeModule.forFeature([Transactions, Participants, Budgets])],
})
export class TransactionsModule {}

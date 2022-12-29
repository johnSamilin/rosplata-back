import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transactions } from '../models/Transactions';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [SequelizeModule.forFeature([Transactions])],
})
export class TransactionsModule {}

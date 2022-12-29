import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Budgets } from 'src/api/models/Budgets';
import { Transactions } from '../models/Transactions';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [SequelizeModule.forFeature([Budgets, Transactions])],
})
export class BudgetsModule {}

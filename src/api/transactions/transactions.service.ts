import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Transactions } from '../models/Transactions';
import { Users } from '../models/Users';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions)
    private transactions: typeof Transactions,
  ) { }

  async getAllByBudget(budgetId: number) {
    return await this.transactions.findAll({
      where: {
        budgetId: {
          [Op.eq]: budgetId,
        },
      },
      include: [
        {
          model: Users,
          attributes: ['id', 'name', 'picture'],
        },
      ],
    });
  }

  async create(budgetId: number, ownerId: string, amount: number) {
    return this.transactions.create({
      budgetId,
      ownerId,
      amount,
    });
  }
}

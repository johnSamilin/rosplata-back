import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Budgets } from 'src/api/models/Budgets';
import { Op } from 'sequelize';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budgets)
    private budgets: typeof Budgets,
  ) {}

  async getAll(userId: string) {
    return this.budgets.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      }
    });
  }

  async get(id: string, userId: string) {
    return this.budgets.findOne({
      where: {
        userId: {
          [Op.eq]: userId,
        },
        id: {
          [Op.eq]: id,
        }
      }
    });
  }

  async create(name: string, userId: string) {
    return this.budgets.create({
      name,
      userId,
    });
  }
}

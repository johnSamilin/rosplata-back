import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Budgets } from 'src/models/Budgets';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budgets)
    private budgets: typeof Budgets,
  ) {}

  async getAll() {
    return this.budgets.findAll();
  }

  async get(id: string) {
    return this.budgets.findByPk(id);
  }

  async create(name) {
    return this.budgets.create({
      name,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Budgets } from 'src/api/models/Budgets';
import { Op } from 'sequelize';
import { Transactions } from '../models/Transactions';
import { Users } from '../models/Users';
import { Participants, PARTICIPANT_STATUSES } from '../models/Participants';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budgets)
    private budgets: typeof Budgets,

    @InjectModel(Participants)
    private participants: typeof Participants,
  ) { }

  async getAll(userId: string) {
    const userBudgets = await this.participants.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
      attributes: ['budgetId'],
    });
    return this.budgets.findAll({
      where: {
        [Op.or]: {
          userId: {
            [Op.eq]: userId,
          },
          id: {
            [Op.in]: userBudgets.map((p) => p.budgetId),
          },
        }
      },
      include: [
        {
          model: Transactions,
          include: [
            {
              model: Users,
              attributes: ['id', 'name', 'picture'],
            },
          ],
        },
      ],
    });
  }

  async get(id: string): Promise<Budgets> {
    return this.budgets.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      include: [
        {
          model: Transactions,
          include: [
            {
              model: Users,
              attributes: ['id', 'name', 'picture'],
            },
          ],
        },
        {
          model: Participants,
          attributes: ['id', 'status'],
        },
      ],
    });
  }

  async create(name: string, userId: string) {
    return this.budgets.create({
      name,
      userId,
    });
  }

  addParticipant(budgetId: string, userId: string) {
    return this.participants.create({
      userId,
      budgetId,
      status: PARTICIPANT_STATUSES.INVITED,
    });
  }

  async changeParticipantStatus(
    budgetId: string,
    userId: string,
    status: number,
  ) {
    return this.participants.update(
      {
        status,
      },
      {
        where: {
          userId: {
            [Op.eq]: userId,
          },
          budgetId: {
            [Op.eq]: budgetId,
          },
        },
      },
    );
  }
}

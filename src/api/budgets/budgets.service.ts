import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Budgets } from 'src/api/models/Budgets';
import { Op } from 'sequelize';
import { Transactions } from '../models/Transactions';
import { Users } from '../models/Users';
import { Participants, PARTICIPANT_STATUSES } from '../models/Participants';
import { allowedUserStatuses } from './budgets.controller';
import { IBUDGETTYPES, ICURRENCIES } from '../models/constants';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budgets)
    private budgets: typeof Budgets,

    @InjectModel(Participants)
    private participants: typeof Participants,
  ) {}

  async getAll(userId: string) {
    const userBudgets = await this.participants.findAll({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
      attributes: ['budgetId', 'status'],
    });
    const { budgetIds, statusesByBudgetId } = userBudgets.reduce(
      (acc, { budgetId, status }) => {
        acc.budgetIds.push(budgetId);
        acc.statusesByBudgetId[budgetId] = status;
        return acc;
      },
      { budgetIds: [], statusesByBudgetId: {} },
    );
    const budgets = await this.budgets.findAll({
      where: {
        [Op.or]: {
          userId: {
            [Op.eq]: userId,
          },
          id: {
            [Op.in]: budgetIds,
          },
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
          attributes: ['userId', 'status'],
          include: [
            {
              model: Users,
              attributes: ['name', 'picture'],
            },
          ],
        },
      ],
    });

    return budgets.map((budgetModel) => {
      const budget = budgetModel.get();
      if (budget.userId === userId) {
        budget.currentUserStatus = PARTICIPANT_STATUSES.OWNER;
        return budget;
      }

      budget.currentUserStatus = statusesByBudgetId[budget.id];
      if (!allowedUserStatuses.includes(budget.currentUserStatus)) {
        budget.transactions = [];
        budget.participants = [];
      }

      return budget;
    });
  }

  async get(id: string): Promise<Budgets> {
    const budgetModel = await this.budgets.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      include: [
        {
          model: Transactions,
          separate: true,
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: Users,
              attributes: ['id', 'name', 'picture'],
            },
          ],
        },
        {
          model: Participants,
          attributes: ['userId', 'status'],
          include: [
            {
              model: Users,
              attributes: ['name', 'picture'],
            },
          ],
        },
      ],
    });

    const budget = budgetModel.get();
    budget.currentUserStatus = PARTICIPANT_STATUSES.UNKNOWN;
    return budget;
  }

  async create(
    id: string,
    name: string,
    type: IBUDGETTYPES,
    currency: ICURRENCIES,
    userId: string,
    initialParticipants: string[] = [],
  ) {
    const newBudget = await this.budgets.create({
      id,
      name,
      userId,
      currency,
      type,
    });

    await this.participants.bulkCreate([
      {
        userId,
        budgetId: newBudget.id,
        status: PARTICIPANT_STATUSES.OWNER,
      },
      ...initialParticipants.map((userId) => ({
        userId,
        budgetId: newBudget.id,
        status: PARTICIPANT_STATUSES.INVITED,
      })),
    ]);

    return newBudget;
  }

  async addParticipant(budgetId: string, userId: string) {
    const budget = await this.budgets.findByPk(budgetId, {
      attributes: ['type'],
    });
    return this.participants.create({
      userId,
      budgetId,
      status:
        budget.type === 'open'
          ? PARTICIPANT_STATUSES.ACTIVE
          : PARTICIPANT_STATUSES.WAITING_APPROVAL,
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

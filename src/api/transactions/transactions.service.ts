import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Budgets } from '../models/Budgets';
import { ICURRENCIES } from '../models/constants';
import { Participants, PARTICIPANT_STATUSES } from '../models/Participants';
import { Transactions } from '../models/Transactions';
import { Users } from '../models/Users';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transactions)
    private transactions: typeof Transactions,

    @InjectModel(Participants)
    private participants: typeof Participants,

    @InjectModel(Budgets)
    private budgets: typeof Budgets,
  ) {}

  async getAllByBudget(budgetId: string, userId: string) {
    const currentParticipant = this.participants.findOne({
      where: {
        userId: {
          [Op.eq]: userId,
        },
      },
    });
    const budgetOwner = this.budgets.findByPk(budgetId, {
      attributes: ['userId'],
    });
    if (
      (await currentParticipant)?.status !== PARTICIPANT_STATUSES.ACTIVE &&
      (await budgetOwner).userId !== userId
    ) {
      return [];
    }
    return await this.transactions.findAll({
      where: {
        budgetId: {
          [Op.eq]: budgetId,
        },
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: Users,
          attributes: ['id', 'name', 'picture'],
        },
      ],
    });
  }

  async create(
    id: string,
    budgetId: string,
    ownerId: string,
    amount: number,
    currency: ICURRENCIES,
    comment = '',
  ) {
    const currentParticipant = await this.participants.findOne({
      where: {
        userId: {
          [Op.eq]: ownerId,
        },
        budgetId: {
          [Op.eq]: budgetId,
        },
      },
    });
    const budgetOwner = await this.budgets.findByPk(budgetId, {
      attributes: ['userId'],
    });
    if (
      currentParticipant?.status === PARTICIPANT_STATUSES.ACTIVE ||
      budgetOwner.userId === ownerId
    ) {
      return this.transactions.create({
        id,
        budgetId,
        ownerId,
        amount,
        currency,
        comment,
      });
    }

    throw new Error('You are not approved participant nor budget owner');
  }

  async changeDeletionStatus(
    id: string,
    userId: string,
    isDeleted = true,
  ): Promise<[affectedRows: number]> {
    return await this.transactions.update(
      {
        deleted: isDeleted,
      },
      {
        where: {
          id: {
            [Op.eq]: id,
          },
          ownerId: {
            [Op.eq]: userId,
          },
        },
      },
    );
  }
}

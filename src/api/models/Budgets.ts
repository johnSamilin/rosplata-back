import { ENUM } from 'sequelize';
import {
  AutoIncrement,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CURRENCIES } from './constants';
import { Participants } from './Participants';
import { Transactions } from './Transactions';
import { Users } from './Users';

@Table({
  tableName: 'budgets',
})
export class Budgets extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @ForeignKey(() => Users)
  @Column
  userId: string;

  @HasMany(() => Transactions)
  transactions: Transactions[];

  @HasMany(() => Participants)
  participants: Participants[];

  @Column(ENUM(...CURRENCIES))
  currency: string;

  @Column(ENUM('open', 'private'))
  type: string;

  @Column(ENUM('keep', 'ignore'))
  bannedUserTransactionsAction: string;

  currentUserStatus?: number;
}

export interface BudgetsShort
  extends Pick<Budgets, 'id' | 'name' | 'currentUserStatus' | 'type'> {
  participantsCount: number;
  sum: number;
}

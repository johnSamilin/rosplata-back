import {
  AutoIncrement,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
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

  currentUserStatus?: number;
}

export interface BudgetsShort
  extends Pick<Budgets, 'id' | 'name' | 'currentUserStatus'> {
  participantsCount: number;
  sum: number;
}

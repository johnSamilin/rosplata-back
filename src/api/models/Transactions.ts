import { TEXT, ENUM } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Budgets } from './Budgets';
import { CURRENCIES } from './constants';
import { Users } from './Users';

@Table({
  tableName: 'transactions'
})
export class Transactions extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  @ForeignKey(() => Users)
  ownerId: string;

  @BelongsTo(() => Users)
  user: Users;

  @ForeignKey(() => Budgets)
  @Column
  budgetId: string;

  @Column
  amount: number;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;

  @Column(ENUM(...CURRENCIES))
  currency: string;

  @Column(TEXT)
  comment: string;
}

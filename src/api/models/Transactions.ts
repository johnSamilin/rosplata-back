import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Budgets } from './Budgets';
import { Users } from './Users';

@Table({
  tableName: 'transactions'
})
export class Transactions extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Users)
  ownerId: string;

  @BelongsTo(() => Users)
  user: Users;

  @ForeignKey(() => Budgets)
  @Column
  budgetId: number;

  @Column
  amount: number;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;
}

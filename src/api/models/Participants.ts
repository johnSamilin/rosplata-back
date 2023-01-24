import {
  AutoIncrement,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Budgets } from './Budgets';
import { Users } from './Users';

export const PARTICIPANT_STATUSES = {
  UNKNOWN: -1,
  INVITED: 0,
  ACTIVE: 1,
  BANNED: 2,
  REFUSED: 3,
  OWNER: 4,
};

@Table({
  tableName: 'Participants',
})
export class Participants extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Budgets)
  @Column
  budgetId: string;

  @ForeignKey(() => Users)
  @Column
  userId: string;

  @Column
  status: number;
}

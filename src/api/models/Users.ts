import { Column, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Transactions } from './Transactions';

@Table({
  tableName: 'users',
})
export class Users extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  picture: string;

  @HasMany(() => Transactions)
  transactions: Transactions[];
}

import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

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
}

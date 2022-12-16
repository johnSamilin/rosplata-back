import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Users extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  picture: string;
}

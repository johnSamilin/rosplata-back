import { ENUM } from 'sequelize';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'Stats',
})
export class Stats extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(ENUM('lang', 'useragent'))
  eventType: string;

  @Column
  value: string;
}

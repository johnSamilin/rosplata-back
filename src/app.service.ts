import { Injectable } from '@nestjs/common';
import { Stats } from './api/models/Stats';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Stats)
    private stats: typeof Stats,
  ) { }
  log(eventType: string, value: string) {
    if (value) {
      this.stats.create({
        eventType,
        value,
      });
    }
  }
}

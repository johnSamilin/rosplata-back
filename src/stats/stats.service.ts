import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Stats } from 'src/api/models/Stats';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stats)
    private stats: typeof Stats,
  ) {}

  getLangs() {
    return this.stats.findAll({
      where: {
        eventType: {
          [Op.eq]: 'lang',
        },
      },
    });
  }
  
  getUa() {
    return this.stats.findAll({
      where: {
        eventType: {
          [Op.eq]: 'useragent',
        },
      },
    });
  }
}

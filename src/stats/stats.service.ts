import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Stats } from 'src/api/models/Stats';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stats)
    private stats: typeof Stats,
  ) { }

  getLangs() {
    return this.stats.findAll({
      where: {
        eventType: {
          [Op.eq]: 'lang',
        },
        requestId: {
          [Op.eq]: null
        }
      },
    });
  }

  getUa() {
    return this.stats.findAll({
      where: {
        eventType: {
          [Op.eq]: 'useragent',
        },
        requestId: {
          [Op.eq]: null
        }
      },
    });
  }

  log(eventType: string, value: string) {
    if (value) {
      // this.stats.create({
      //   eventType,
      //   value,
      // });
    }
  }

  logError(text, clientId, ua) {
    const reqId = clientId ?? `${Date.now()}.${Math.random()}`;
    this.stats.create({
      eventType: 'error',
      value: text,
      requestId: reqId,
    });
    this.stats.findOrCreate({
      where: {
        eventType: 'useragent',
        value: ua,
        requestId: reqId,
      },
    });
  }
}

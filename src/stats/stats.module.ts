import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Stats } from 'src/api/models/Stats';

@Module({
  controllers: [StatsController],
  providers: [StatsService],
  imports: [SequelizeModule.forFeature([Stats])],
})
export class StatsModule {}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Res,
  Req,
  UseInterceptors,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { Budgets, BudgetsShort } from '../models/Budgets';
import { PARTICIPANT_STATUSES } from '../models/Participants';
import { BudgetsService } from './budgets.service';

export const allowedUserStatuses = [
  PARTICIPANT_STATUSES.ACTIVE,
  PARTICIPANT_STATUSES.OWNER,
];

@Controller('api/budgets')
@UseGuards(AuthGuard('firebase'))
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get('')
  async list(@Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    return await this.budgetsService.getAll(user.uid);
  }

  @Get(':id')
  async findOne(@Param('id') id, @Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    const budgetModel = await this.budgetsService.get(id);
    let currentUserStatus = PARTICIPANT_STATUSES.UNKNOWN;

    const currentParticipantIndex = budgetModel.participants.findIndex(
      ({ userId }) => userId === user.uid,
    );

    if (user.uid === budgetModel.userId) {
      currentUserStatus = PARTICIPANT_STATUSES.OWNER;
    } else {
      currentUserStatus =
        currentParticipantIndex === -1
          ? PARTICIPANT_STATUSES.UNKNOWN
          : budgetModel.participants[currentParticipantIndex].status;
    }

    const userHasRights = allowedUserStatuses.includes(currentUserStatus);

    const budget: Budgets | BudgetsShort = userHasRights
      ? budgetModel
      : {
          id: budgetModel.id,
          name: budgetModel.name,
          participantsCount: budgetModel.participants.length,
          sum: budgetModel.transactions.reduce((acc, t) => {
            //@ts-ignore
            acc += parseFloat(t.amount);
            return acc;
          }, 0),
        };

    budget.currentUserStatus = currentUserStatus;
    return budget;
  }

  @Put('')
  @UseInterceptors(FileInterceptor('body'))
  async create(@Body() body, @Res() res: Response, @Req() req: Request) {
    // @ts-ignore
    const user = req.user;
    if (
      !body.name ||
      body.name.length < 3 ||
      body.name.length > 20 ||
      /([^\w\d ]+)/gi.test(body.name)
    ) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }
    const newBudget = await this.budgetsService.create(body.name, user.uid);

    res.status(HttpStatus.CREATED).send({ id: newBudget.id });
  }

  @Post(':id/participant')
  @UseInterceptors(FileInterceptor('body'))
  async sendParticipationRequest(
    @Param('id') id,
    @Body() body,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const user = req.user;
    const budget = await this.budgetsService.get(id);
    if (user.uid === budget.userId) {
      res.status(HttpStatus.BAD_REQUEST).send('You are already an owner');

      return;
    }
    await this.budgetsService.addParticipant(id, user.uid);

    res.status(HttpStatus.OK).send({ id });
  }

  @Post(':id/participant/:participantId')
  @UseInterceptors(FileInterceptor('body'))
  async changeParticipantStatus(
    @Param('id') budgetId,
    @Param('participantId') participantId,
    @Body() body,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // @ts-ignore
    const user = req.user;
    const budget = await this.budgetsService.get(budgetId);
    if (user.uid !== budget.userId) {
      res.status(HttpStatus.BAD_REQUEST).send('You are not an owner');

      return;
    }
    await this.budgetsService.changeParticipantStatus(
      budgetId,
      participantId,
      body.status,
    );

    res.status(HttpStatus.OK).send({ id: budgetId });
  }
}

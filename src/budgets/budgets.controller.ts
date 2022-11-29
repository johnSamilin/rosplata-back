import { Controller, Get } from '@nestjs/common';

@Controller('api/budgets')
export class BudgetsController {
  @Get('')
  list() {
    return [];
  }
}

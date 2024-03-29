import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Users } from 'src/api/models/Users';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private users: typeof Users,
  ) {}

  async upsert(id: string, name: string, email: string, picture: string) {
    return this.users.upsert({
      id,
      name,
      email,
      picture,
    });
  }

  async changeLang(userId: string, code: string) {
    return this.users.update(
      {
        lang: code,
      },
      {
        where: {
          id: {
            [Op.eq]: userId,
          },
        },
      },
    );
  }
}

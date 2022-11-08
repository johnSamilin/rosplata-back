import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sendIndexHtml(): string {
    return 'Hello World!';
  }
}

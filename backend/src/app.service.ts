import { Injectable } from '@nestjs/common';
import { HelloWorldResponse } from './hello-world-response.dto';

@Injectable()
export class AppService {
  getHello(): HelloWorldResponse {
    return { message: 'Hello World!' };
  }
}

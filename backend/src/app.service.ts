import { Injectable } from '@nestjs/common';
import { HelloWorldResponseDto } from './hello-world-response.dto';

@Injectable()
export class AppService {
  getHello(): HelloWorldResponseDto {
    return { message: 'Hello World!' };
  }
}

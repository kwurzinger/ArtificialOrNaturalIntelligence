import { ApiProperty } from '@nestjs/swagger';

export class HelloWorldResponse {
  @ApiProperty({ example: 'Hello World!' })
  message: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class HelloWorldResponseDto {
  @ApiProperty({ example: 'Hello World!' })
  message: string;
}
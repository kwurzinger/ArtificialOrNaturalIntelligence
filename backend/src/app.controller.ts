import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelloWorldResponseDto } from './hello-world-response.dto';

@ApiTags('hello')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiOperation({ summary: 'Gibt eine Hello-World-Nachricht zurück' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: HelloWorldResponseDto,
  })
  getHello(): HelloWorldResponseDto {
    return this.appService.getHello();
  }
}
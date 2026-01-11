import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelloWorldResponse } from './dto/hello-world-response.dto';

@Controller()
@ApiTags('Hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  @ApiOperation({ summary: 'Gibt eine Hello-World-Nachricht zurück' })
  @ApiOkResponse({
    description: 'Erfolgreiche Antwort',
    type: HelloWorldResponse,
  })
  getHello(): HelloWorldResponse {
    return this.appService.getHello();
  }
}
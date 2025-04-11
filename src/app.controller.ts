import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/metadata.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  getProfile(
    @Request()
    req,
  ) {
    return req.user;
  }
}

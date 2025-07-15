import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { EmojiValidationPipe } from './common/emoji-validation/emoji-validation.pipe';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Req() request: Request,
    @Query('index', EmojiValidationPipe) index?: number,
  ) {
    console.log('Route Handler');
    return {
      emoji: this.appService.getEmoji(index),
      browser: request.headers['x-browser'],
    };
  }
}

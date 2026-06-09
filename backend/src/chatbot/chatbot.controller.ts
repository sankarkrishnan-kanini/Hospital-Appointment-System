import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chatbot')
@UseGuards(AuthGuard)
export class ChatbotController {
  constructor(private chatbotService: ChatbotService) {}

  @Get('data')
  async getChatbotData(@Query('role') role: string) {
    return this.chatbotService.getChatbotData(role || 'all');
  }

  @Get('symptoms')
  async getSymptoms() {
    return this.chatbotService.getSymptoms();
  }

  @Get('faqs')
  async getFaqs(@Query('role') role: string) {
    return this.chatbotService.getFaqs(role);
  }

  @Get('config')
  async getConfig(@Query('role') role: string) {
    return this.chatbotService.getConfig(role);
  }
}

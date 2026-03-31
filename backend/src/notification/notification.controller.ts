import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';

@Controller('notification')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll() {
    return await this.notificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.notificationService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() dto: UpdateNotificationDto) {
    return await this.notificationService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.notificationService.remove(id);
  }
}

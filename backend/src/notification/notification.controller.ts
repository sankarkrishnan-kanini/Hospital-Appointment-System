import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './DTOS/createNotificationDTO';
import { UpdateNotificationDto } from './DTOS/updateNotificationDTO';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

 
  @Get()
  async findAll() {
    return await this.notificationService.findAll();
  }

  
  @Get('user/:userId')
  @Roles(Role.Admin, Role.Doctor, Role.Patient)
  @UseGuards(RoleGuard)
  async findByUser(@Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number) {
    return await this.notificationService.findByUser(userId);
  }

 
  @Get('user/:userId/unread')
  async findUnread(@Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number) {
    return await this.notificationService.findUnread(userId);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.notificationService.findOne(id);
  }
  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return await this.notificationService.create(dto);
  }
  @Patch('user/:userId/mark-all-read')
  async markAllRead(@Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number) {
    return await this.notificationService.markAllRead(userId);
  }
  @Patch(':id/read')
  async markAsRead(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.notificationService.markAsRead(id);
  }

 
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @Body() dto: UpdateNotificationDto
  ) {
    return await this.notificationService.update(id, dto);
  }

  @Delete('user/:userId/clear-read')
  async clearRead(@Param('userId', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) userId: number) {
    return await this.notificationService.clearRead(userId);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return await this.notificationService.remove(id);
  }
}

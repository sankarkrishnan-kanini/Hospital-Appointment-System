import { Controller, Get, Patch, Param, Request, ParseIntPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@Request() req) {
    return this.notificationService.getNotifications(req.user.sub);
  }

  @Patch(':id/read')
  markAsRead(
    @Request() req,
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number
  ) {
    return this.notificationService.markAsRead(req.user.sub, id);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.sub);
  }
}

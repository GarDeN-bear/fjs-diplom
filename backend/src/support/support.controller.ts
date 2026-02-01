import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  Put,
} from '@nestjs/common';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SupportService } from './support.service';
import { SupportEmployeeService } from './support-employee.service';
import { SupportClientService } from './support-client.service';
import {
  CreateSupportRequestDto,
  GetChatListParamsDto,
  MarkMessagesAsReadDto,
  SendMessageDto,
} from './dto/support.dto';
import { SupportDocument } from './schemas/support.schema';
import { Message } from './messages/schemas/message.schema';

@Controller('api')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly supportClientService: SupportClientService,
    private readonly supportEmployeeService: SupportEmployeeService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('client/support-requests')
  @HttpCode(HttpStatus.CREATED)
  createSupportRequest(
    @Body() data: CreateSupportRequestDto,
  ): Promise<SupportDocument> {
    return this.supportClientService.createSupportRequest(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get('client/support-requests')
  @HttpCode(HttpStatus.OK)
  findSupportRequestsForClient(
    @Query() params: GetChatListParamsDto,
  ): Promise<SupportDocument[]> {
    return this.supportService.findSupportRequests(params);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Get('manager/support-requests')
  @HttpCode(HttpStatus.OK)
  findSupportRequestsForManager(
    @Query() params: GetChatListParamsDto,
  ): Promise<SupportDocument[]> {
    return this.supportService.findSupportRequests(params);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Get('common/support-requests/:id/messages')
  @HttpCode(HttpStatus.OK)
  getMessages(@Param('id') supportRequest: string): Promise<Message[]> {
    return this.supportService.getMessages(supportRequest);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Post('common/support-requests/:id/messages')
  @HttpCode(HttpStatus.OK)
  sendMessage(@Body() message: SendMessageDto): Promise<Message> {
    return this.supportService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Post('common/support-requests/:id/messages/read')
  @HttpCode(HttpStatus.OK)
  read(
    @Body() data: MarkMessagesAsReadDto,
    @Request() req: any,
  ): Promise<void> {
    const role = req.user.role;
    if (role === 'client') {
      return this.supportClientService.markMessagesAsRead(data);
    } else {
      return this.supportEmployeeService.markMessagesAsRead(data);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client', 'manager')
  @Get('common/support-requests/unread-count/:id')
  @HttpCode(HttpStatus.OK)
  getUreadCount(
    @Param('id') supportRequest: string,
    @Request() req: any,
  ): Promise<Message[]> {
    const role = req.user.role;
    if (role === 'client') {
      return this.supportClientService.getUnreadCount(supportRequest);
    } else {
      return this.supportEmployeeService.getUnreadCount(supportRequest);
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @Put('common/support-requests/close/:id')
  @HttpCode(HttpStatus.OK)
  closeRequest(@Param('id') supportRequest: string) {
    this.supportEmployeeService.closeRequest(supportRequest);
  }
}

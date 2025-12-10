import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  ReservationSearchOptionsDto,
} from './dto/reservation.dto';
import { ReservationDocument } from './schemas/reservation.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('api')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('manager')
  @Get('manager/reservations/')
  getReservationsForManager(
    @Body() filter: ReservationSearchOptionsDto,
  ): Promise<ReservationDocument[]> {
    return this.reservationsService.getReservations(filter);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('manager')
  @Delete('manager/reservations/:id')
  removeReservationForManager(@Param('id') id: string): Promise<void> {
    return this.reservationsService.removeReservation(id);
  }

  // @UseGuards(RolesGuard, JwtAuthGuard)
  // @Roles('client')
  @Post('client/reservations/')
  addReservationForClient(
    @Body() data: CreateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationsService.addReservation(data);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('client')
  @Get('client/reservations/')
  getReservationsForClient(
    @Body() filter: ReservationSearchOptionsDto,
  ): Promise<ReservationDocument[]> {
    return this.reservationsService.getReservations(filter);
  }

  @UseGuards(RolesGuard, JwtAuthGuard)
  @Roles('client')
  @Delete('client/reservations/:id')
  removeReservationForClient(@Param('id') id: string): Promise<void> {
    return this.reservationsService.removeReservation(id);
  }
}

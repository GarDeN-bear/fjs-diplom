import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  ReservationSearchOptionsDto,
} from './dto/reservation.dto';
import { ReservationDocument } from './schemas/reservation.schema';

@Controller('/api/manager/reservations')
export class ReservationsManagerController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  getReservations(
    @Body() filter: ReservationSearchOptionsDto,
  ): Promise<ReservationDocument[]> {
    return this.reservationsService.getReservations(filter);
  }

  @Delete(':id')
  removeReservation(@Param('id') id: string): Promise<void> {
    return this.reservationsService.removeReservation(id);
  }
}

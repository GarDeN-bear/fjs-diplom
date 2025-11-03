import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  CreateReservationDto,
  ReservationSearchOptionsDto,
} from './dto/reservation.dto';
import { ReservationDocument } from './schemas/reservation.schema';

@Controller('/api/client/reservations')
export class ReservationsClientController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  addReservation(
    @Body() data: CreateReservationDto,
  ): Promise<ReservationDocument> {
    return this.reservationsService.addReservation(data);
  }

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

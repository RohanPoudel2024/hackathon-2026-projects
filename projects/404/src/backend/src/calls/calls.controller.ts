import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('calls')
@UseGuards(JwtAuthGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get('ice-servers')
  getIceServers() {
    return this.callsService.getIceServers();
  }

  @Get('session/:appointmentId')
  getSessionByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.callsService.getSessionByAppointmentId(appointmentId);
  }
}

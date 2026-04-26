import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CallStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

const callSessionSelect = {
  id: true,
  appointmentId: true,
  doctorId: true,
  patientId: true,
  status: true,
  startedAt: true,
  endedAt: true,
} satisfies Prisma.CallSessionSelect;

type IceServer = {
  urls: string[];
  username?: string;
  credential?: string;
};

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}

  async getIceServers() {
    const servers: IceServer[] = [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
      },
    ];

    if (
      process.env.TURN_URL &&
      process.env.TURN_USERNAME &&
      process.env.TURN_CREDENTIAL
    ) {
      servers.push({
        urls: [process.env.TURN_URL],
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL,
      });
    }

    return servers;
  }

  async initiateCall(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        doctorId: true,
        patientId: true,
        doctor: { select: { userId: true } },
        patient: { select: { userId: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const doctorUserId = appointment.doctor.userId;
    const patientUserId = appointment.patient.userId;

    if (userId !== doctorUserId && userId !== patientUserId) {
      throw new ForbiddenException('Not allowed to call');
    }

    const existing = await this.prisma.callSession.findUnique({
      where: { appointmentId },
      select: callSessionSelect,
    });

    if (existing && existing.status !== CallStatus.ENDED) {
      throw new BadRequestException('Call already active');
    }

    const session = await this.prisma.callSession.upsert({
      where: { appointmentId },
      update: {
        status: CallStatus.INITIATED,
        startedAt: null,
        endedAt: null,
      },
      create: {
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        status: CallStatus.INITIATED,
      },
      select: callSessionSelect,
    });

    const calleeUserId = userId === doctorUserId ? patientUserId : doctorUserId;

    return {
      session,
      calleeUserId,
    };
  }

  async acceptCall(callSessionId: string, userId: string) {
    const session = await this.ensureParticipant(callSessionId, userId);

    if (session.status !== CallStatus.INITIATED) {
      throw new BadRequestException('Call is not available');
    }

    return this.prisma.callSession.update({
      where: { id: callSessionId },
      data: { status: CallStatus.ONGOING, startedAt: new Date() },
      select: callSessionSelect,
    });
  }

  async rejectCall(callSessionId: string, userId: string) {
    await this.ensureParticipant(callSessionId, userId);

    return this.prisma.callSession.update({
      where: { id: callSessionId },
      data: { status: CallStatus.MISSED, endedAt: new Date() },
      select: callSessionSelect,
    });
  }

  async endCall(callSessionId: string, userId: string) {
    await this.ensureParticipant(callSessionId, userId);

    return this.prisma.callSession.update({
      where: { id: callSessionId },
      data: { status: CallStatus.ENDED, endedAt: new Date() },
      select: callSessionSelect,
    });
  }

  async assertParticipant(callSessionId: string, userId: string) {
    await this.ensureParticipant(callSessionId, userId);
  }

  private async ensureParticipant(callSessionId: string, userId: string) {
    const session = await this.prisma.callSession.findUnique({
      where: { id: callSessionId },
      select: {
        id: true,
        status: true,
        doctorId: true,
        patientId: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Call session not found');
    }

    const [doctor, patient] = await this.prisma.$transaction([
      this.prisma.doctor.findUnique({
        where: { id: session.doctorId },
        select: { userId: true },
      }),
      this.prisma.patient.findUnique({
        where: { id: session.patientId },
        select: { userId: true },
      }),
    ]);

    if (!doctor || !patient) {
      throw new NotFoundException('Call participants not found');
    }

    if (doctor.userId !== userId && patient.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    return session;
  }
}

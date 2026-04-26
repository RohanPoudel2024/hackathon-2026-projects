import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { CallsService } from './calls.service';
import type { CallInitiateDto } from './dto/call-initiate.dto';
import type { CallActionDto } from './dto/call-action.dto';
import type { CallSignalDto } from './dto/call-signal.dto';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: { origin: '*' } })
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly socketUsers = new Map<string, JwtPayload>();
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly callsService: CallsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });

      this.socketUsers.set(client.id, payload);
      const set = this.userSockets.get(payload.sub) ?? new Set<string>();
      set.add(client.id);
      this.userSockets.set(payload.sub, set);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const payload = this.socketUsers.get(client.id);
    this.socketUsers.delete(client.id);

    if (payload) {
      const sockets = this.userSockets.get(payload.sub);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(payload.sub);
        }
      }
    }
  }

  @SubscribeMessage('call:initiate')
  async initiateCall(
    @MessageBody() body: CallInitiateDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    const { session, calleeUserId } = await this.callsService.initiateCall(
      body.appointmentId,
      user.sub,
    );

    const room = this.roomName(session.id);
    client.join(room);

    this.emitToUser(calleeUserId, 'call:incoming', {
      session,
      callerId: user.sub,
    });

    return { session };
  }

  @SubscribeMessage('call:accept')
  async acceptCall(
    @MessageBody() body: CallActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    const session = await this.callsService.acceptCall(
      body.callSessionId,
      user.sub,
    );

    const room = this.roomName(session.id);
    client.join(room);
    this.server.to(room).emit('call:accepted', { session });

    return { session };
  }

  @SubscribeMessage('call:reject')
  async rejectCall(
    @MessageBody() body: CallActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    const session = await this.callsService.rejectCall(
      body.callSessionId,
      user.sub,
    );

    const room = this.roomName(session.id);
    this.server.to(room).emit('call:rejected', { session });

    return { session };
  }

  @SubscribeMessage('call:end')
  async endCall(
    @MessageBody() body: CallActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    const session = await this.callsService.endCall(
      body.callSessionId,
      user.sub,
    );

    const room = this.roomName(session.id);
    this.server.to(room).emit('call:ended', { session });

    return { session };
  }

  @SubscribeMessage('webrtc:offer')
  async sendOffer(
    @MessageBody() body: CallSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    await this.callsService.assertParticipant(body.callSessionId, user.sub);
    const room = this.roomName(body.callSessionId);
    this.server
      .to(room)
      .emit('webrtc:offer', { from: user.sub, payload: body.payload });
  }

  @SubscribeMessage('webrtc:answer')
  async sendAnswer(
    @MessageBody() body: CallSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    await this.callsService.assertParticipant(body.callSessionId, user.sub);
    const room = this.roomName(body.callSessionId);
    this.server
      .to(room)
      .emit('webrtc:answer', { from: user.sub, payload: body.payload });
  }

  @SubscribeMessage('webrtc:ice')
  async sendIce(
    @MessageBody() body: CallSignalDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.getUser(client);
    await this.callsService.assertParticipant(body.callSessionId, user.sub);
    const room = this.roomName(body.callSessionId);
    this.server
      .to(room)
      .emit('webrtc:ice', { from: user.sub, payload: body.payload });
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      return String(authToken);
    }
    const header = client.handshake.headers?.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice(7);
    }
    return undefined;
  }

  private getUser(client: Socket) {
    const user = this.socketUsers.get(client.id);
    if (!user) {
      client.disconnect();
      throw new Error('Unauthorized');
    }
    return user;
  }

  private emitToUser(userId: string, event: string, payload: unknown) {
    const sockets = this.userSockets.get(userId);
    if (!sockets) {
      return;
    }
    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, payload);
    }
  }

  private roomName(callSessionId: string) {
    return `call:${callSessionId}`;
  }
}

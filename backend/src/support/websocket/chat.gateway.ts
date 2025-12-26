import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from '../messages/schemas/message.schema';
import { SupportDocument } from '../schemas/support.schema';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private eventEmitter: EventEmitter2) {
    this.eventEmitter.on('joinRoom', (data) => {
      this.handleJoinRoom(data.userId, data.roomId);
    });
    this.eventEmitter.on('leaveRoom', (data) => {
      this.handleLeaveRoom(data.userId, data.roomId);
    });
    this.eventEmitter.on('sendSupportRequest', (data) => {
      this.handleSendSupportRequest(data);
    });
    this.eventEmitter.on('sendMessage', (data) => {
      this.handleSendMessageToRoom(data.roomId, data.message);
    });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.userSockets.set(userId, client.id);
    }
    console.log(`Connected: ${client.id}, User: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    console.log(`Disconnected: ${client.id}`);
  }

  private handleJoinRoom(userId: string, roomId: string) {
    const socketId = this.userSockets.get(userId);

    if (!socketId) {
      console.warn(
        `User ${userId} is not connected, cannot join room ${roomId}`,
      );
      return;
    }

    const socket = this.server.sockets.sockets.get(socketId);

    if (!socket) {
      console.warn(
        `Socket not found for user ${userId}, socketId: ${socketId}`,
      );
      return;
    }

    socket.join(roomId);

    console.log(`User ${userId} joined room ${roomId} via EventEmitter`);
  }

  @SubscribeMessage('joinClientToRoom')
  handleJoinClientRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const { userId, roomId } = data;

    if (!userId || !roomId) {
      console.warn('Missing userId or roomId in joinClientToRoom');
      return;
    }

    const clientUserId = client.handshake.auth.userId;
    if (clientUserId !== userId) {
      console.warn(`User ${clientUserId} trying to join as ${userId}`);
      return;
    }

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, client.id);
    }

    client.join(roomId);

    console.log(`User ${userId} joined room ${roomId} via socket`);
  }

  private handleLeaveRoom(userId: string, roomId: string): void {
    const socketId = this.userSockets.get(userId);

    if (!socketId) {
      console.warn(
        `User ${userId} is not connected, cannot leave room ${roomId}`,
      );
      return;
    }

    const socket = this.server.sockets.sockets.get(socketId);

    if (!socket) {
      console.warn(
        `Socket not found for user ${userId}, socketId: ${socketId}`,
      );
      return;
    }

    socket.leave(roomId);
    console.log(`User ${userId} left room ${roomId} via EventEmitter`);
  }

  private handleSendSupportRequest(supportRequest: SupportDocument) {
    const roomId: string = supportRequest._id.toString();
    this.server.to(roomId).emit('newSupportRequest', supportRequest);
    console.log(`Support request sent to room ${roomId} via EventEmitter`);
  }

  private handleSendMessageToRoom(roomId: string, message: Message): void {
    this.server
      .to(roomId)
      .emit('newMessage', { supportRequest: roomId, message: message });
    console.log(`Message sent to room ${roomId} via EventEmitter`);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
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
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';


@WebSocketGateway({
  cors: {
    origin: '*', // allow frontend to connect
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private userSocketMap = new Map<string, number>(); // socketId => userId
  constructor(private readonly chatService: ChatService) {}
  private onlineUsers = new Set<number>();

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || client.handshake.query?.userId;

    if (!userId) {
      console.log('No userId in auth payload or query, disconnecting client:', client.id);
      client.disconnect(true); // Force disconnect immediately
      return;
    }

    this.userSocketMap.set(client.id, userId);
    this.onlineUsers.add(userId);

    console.log(`User ${userId} connected`);

    // Send updated online user list to all clients
    this.server.emit('userOnline', Array.from(this.onlineUsers));
  }

  @SubscribeMessage('userOnline')
  handleUserOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ) {
    this.userSocketMap.set(client.id, userId);
    console.log(`User ${userId} is online`);
    client.broadcast.emit('userOnline', userId);
  }

  handleDisconnect(client: Socket) {
    const userId = this.userSocketMap.get(client.id);
    if (userId) {
      this.userSocketMap.delete(client.id);
      this.onlineUsers.delete(userId);
      console.log(`User ${userId} is offline`);
      this.server.emit('userOnline', Array.from(this.onlineUsers)); // Broadcast updated list
    }
  }

  /// Group Chat Logic

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    await client.join(roomId.toString());
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('sendGroupMessage')
  async handleGroupMessage(
    @MessageBody() payload: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.createMessage(payload);
    this.server.to(payload.roomId.toString()).emit('groupMessage', message);
    console.log(`Message sent to room ${payload.roomId}:`, message);
  }

  @SubscribeMessage('loadHistory')
  async handleLoadHistory(
    @MessageBody() roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessages(roomId);
    client.emit('messageHistory', messages);
  }

  // Chat Logic

  // @SubscribeMessage('sendPrivateMessage')
  // async handlePrivateMessage(
  //   @MessageBody() payload: ChatDto,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const message = await this.chatService.createMessage(payload);

  //   this.server.to(payload.senderId.toString()).emit('privateMessage', message);
  //   // console.log(
  //   //   `Private message sent from ${payload.senderId} :`,
  //   //   message,
  //   // );
  // }

  @SubscribeMessage('sendPrivateMessage')
  async handlePrivateMessage(
    @MessageBody()
    payload: {
      senderId: number;
      senderEmail?: string;
      receiverId: number;
      content: string;
      image?: string;
      replyToMessageId?: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = await this.chatService.getOrCreatePrivateRoom(
      payload.senderId,
      payload.receiverId,
    );

    const message = await this.chatService.createMessage({
      senderId: payload.senderId,
      senderEmail: payload.senderEmail,
      roomId: room.id,
      content: payload.content,
      image: payload.image,
      replyToMessageId: payload.replyToMessageId,
    });

    console.log(`Private message sent from `, message);

    // Emit to both sender and receiver
    this.server
      .to(payload.senderId.toString())
      .emit('privateMessage', message);
    this.server
      .to(payload.receiverId.toString())
      .emit('privateMessage', message);
  }

  @SubscribeMessage('joinPrivateRoom')
  async handleJoinPrivateRoom(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(userId.toString()); // Join room named after userId
    console.log(`Client ${client.id} joined private room of user ${userId}`);
  }

  @SubscribeMessage('loadPrivateHistory')
  async handlePrivateLoadHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: number; receiverId: number },
  ): Promise<void> {
    const messages = await this.chatService.getMessageBetweenUser(
      payload.senderId,
      payload.receiverId,
    );
    client.emit('messageHistory', messages);
  }

  @SubscribeMessage('userTyping')
  handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { roomId, isGroup, senderId } = data;
    if (isGroup) {
      this.server.to(roomId).emit('userTyping', { senderId });
    } else {
      this.server
        .to(data.receiverId.toString())
        .emit('userTyping', { senderId });
    }
  }

  @SubscribeMessage('userStopTyping')
  handleStopTyping(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, isGroup, senderId } = data;
    if (isGroup) {
      this.server.to(roomId).emit('userStopTyping', { senderId });
    } else {
      client.to(data.receiverSocketId).emit('userStopTyping', { senderId });
    }
  }
}





  /* eslint-disable prettier/prettier */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  // /* eslint-disable @typescript-eslint/no-unused-vars */
  // /* eslint-disable prettier/prettier */
  // import {
  //   ConnectedSocket,
  //   MessageBody,
  //   OnGatewayConnection,
  //   OnGatewayDisconnect,
  //   SubscribeMessage,
  //   WebSocketGateway,
  //   WebSocketServer,
  // } from '@nestjs/websockets';
  // import { ChatService } from './chat.service';
  // import { Server, Socket } from 'socket.io';
  // import { ChatDto } from './dto/chat.dto';




  // // @WebSocketGateway({
  // //   cors: {
  // //     origin: '*', // allow frontend to connect
  // //   },
  // // })
  // // export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // //   constructor(private readonly chatService: ChatService) {}

  // //   @WebSocketServer() server: Server;

  // //   handleConnection(client: Socket) {
  // //     console.log(`Client connected: ${client.id}`);
  // //   }

  // //   handleDisconnect(client: Socket) {
  // //     console.log(`Client disconnected: ${client.id}`);
  // //   }

  // //   @SubscribeMessage('joinRoom')
  // //   handleToJoinRoom(
  // //     @ConnectedSocket() client: Socket,
  // //     @MessageBody() roomId: number,
  // //   ) {
  // //     client.join(roomId.toString());
  // //     console.log(`Client ${client.id} joined room ${roomId}`);
  // //   }

  // //   @SubscribeMessage('sendMessage')

  // //   async handleMessage(@MessageBody() payload: ChatDto): Promise<void> {
  // //     const message = await this.chatService.createMessage(payload);
  // //     this.server.emit('receiveMessage', message); // broadcast to all
  // //   }

  // //   @SubscribeMessage('groupMessage')
  // //   async handleGroupMessage(
  // //     @MessageBody() payload: ChatDto,
  // //     @ConnectedSocket() client: Socket,
  // //   ): Promise<void> {
  // //     if (!payload.roomId) {
  // //       console.warn('Missing roomId in group message');
  // //       return;
  // //     }

  // //     const message = await this.chatService.createMessage(payload);

  // //     // Send to all clients in the room including sender
  // //     this.server.to(payload.roomId.toString()).emit('roomMessage', message);
  // //   }

  // //   @SubscribeMessage('loadHistory')
  // //   async handleLoadHistory(
  // //     @ConnectedSocket() client: Socket,
  // //     @MessageBody() payload: { senderId: number; receiverId: number },
  // //   ): Promise<void> {
  // //     const messages = await this.chatService.getMessageBetweenUser(
  // //       payload.senderId,
  // //       payload.receiverId,
  // //     );
  // //     client.emit('messageHistory', messages);
  // //   }
  // // }


  // @WebSocketGateway({
  //   cors: {
  //     origin: '*',
  //   },
  // })
  // export class ChatGateway {
  //   constructor(private readonly chatService: ChatService) {}

  //   @WebSocketServer() server: Server;

  //   handleConnection(client: Socket) {
  //     console.log(`Connected: ${client.id}`);
  //   }

  //   handleDisconnect(client: Socket) {
  //     console.log(`Disconnected: ${client.id}`);
  //   }

  //   @SubscribeMessage('joinRoom')
  //   handleJoinRoom(
  //     @MessageBody() roomId: number,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     client.join(roomId.toString());
  //     console.log(`Joined room ${roomId}`);
  //   }

  //   @SubscribeMessage('sendGroupMessage')
  //   async handleGroupMessage(
  //     @MessageBody() payload: ChatDto,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     const message = await this.chatService.createMessage(payload);
  //     this.server.to(payload.roomId.toString()).emit('groupMessage', message);
  //     // console.log(`Message sent to room ${payload.roomId}:`, message);
  //   }

  //   @SubscribeMessage('loadHistory')
  //   async handleLoadHistory(
  //     @MessageBody() roomId: number,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     const messages = await this.chatService.getMessages(roomId);
  //     client.emit('messageHistory', messages);
  //   }
  // }




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
    constructor(private readonly chatService: ChatService) {}

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
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
        senderEmail: '', // If available
        roomId: room.id,
        content: payload.content,
        image: payload.image,
        replyToMessageId: payload.replyToMessageId,
      });

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
  }

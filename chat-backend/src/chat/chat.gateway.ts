/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';


@WebSocketGateway(
 { cors: {
    origin: '*', // allow frontend to connect
  },}
)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) { }
  
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: ChatDto): Promise<void> {
    const message = await this.chatService.createMessage(payload);
    this.server.emit('receiveMessage', message); // broadcast to all
  }

  @SubscribeMessage('loadHistory')
  async handleLoadHistory(
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

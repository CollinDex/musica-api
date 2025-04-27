import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  WebSocketServer,
  WsResponse,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket.id', socket.id);
      console.log('Socket.connected', socket.connected);
    });
  }

  @SubscribeMessage('message')
  newMessage(
    @MessageBody()
    data: any,
  ): Observable<WsResponse<any>> {
    console.log('Message is received from the client');
    console.log('Data', data);
    return of({ event: 'message', data: 'Learn Node' });
  }
}

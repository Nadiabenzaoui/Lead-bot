import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server | null = null;

export function initWebSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: '*' } });
  io.on('connection', (socket: Socket) => {
    console.log('[WS] Client connected:', socket.id);
    socket.on('disconnect', () => console.log('[WS] Client disconnected:', socket.id));
  });
  return io;
}

export function getIO(): Server | null {
  return io;
}

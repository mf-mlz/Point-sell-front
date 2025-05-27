import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private baseUrl = environment.baseUrl;

  connect() {
    if (!this.socket || !this.socket.connected) {
      const baseUrl = this.baseUrl;
      this.socket = io(baseUrl, {
        withCredentials: true,
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket conectado');
      });

      this.socket.on('connect_error', (err) => {
        console.error('Error de conexión al WebSocket:', err);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('WebSocket desconectado');
    }
  }
  
}


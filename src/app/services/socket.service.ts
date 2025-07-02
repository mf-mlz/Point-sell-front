import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private baseUrl = environment.baseUrl;

  private notificacionSubject = new Subject<any>();
  notifys$ = this.notificacionSubject.asObservable();

  connect() {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.baseUrl, {
        withCredentials: true,
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket conectado');
      });

      /* Notify Emit */
      this.socket.on('notify', (data) => {
        this.notificacionSubject.next(data); 
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

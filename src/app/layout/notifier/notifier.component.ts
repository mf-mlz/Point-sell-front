import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { SwalService } from '../../../../src/app/services/swal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notifier',
  template: '',
  standalone: true,
})
export class NotifierComponent implements OnInit {
  public apiUpload = environment.apiUpload;
  constructor(
    private socketService: SocketService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.socketService.connect();

    this.socketService.notifys$.subscribe((data) => {
      switch (data.type) {
        case 'login':
          const htmlContent = `${
            data.icon
              ? `<img src="${
                  this.apiUpload + data.icon
                }" alt="foto" style="width:40px;height:40px;border-radius:50%;margin-right:8px;" />`
              : ''
          }<span>${data.message}</span>`;
          this.swalService.showToast(
            'info',
            htmlContent,
            '',
            'html',
            () => {},
            'bottom-end'
          );
          this.playSound('Connect.mp3');
          break;
        case 'logout':
          const htmlContentLogout = `${
            data.icon
              ? `<img src="${
                  this.apiUpload + data.icon
                }" alt="foto" style="width:40px;height:40px;border-radius:50%;margin-right:8px;" />`
              : ''
          }<span>${data.message}</span>`;
          this.swalService.showToast(
            'info',
            htmlContentLogout,
            '',
            'html',
            () => {},
            'bottom-end'
          );
          this.playSound('Disconnect.mp3');
          break;
        default:
          console.log(`🔔 Notificación: ${data.mensaje}`);
      }
    });
  }

  playSound(audioName: string): void {
    const audio = new Audio();
    audio.src = 'assets/sounds/'+audioName;
    audio.load();
    audio.play();
    audio.play().catch((err) => {
      console.error('Error al reproducir el sonido:', err);
    });
  }
}

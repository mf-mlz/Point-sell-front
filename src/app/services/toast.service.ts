import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  showToast(icon: SweetAlertIcon, title: string, text: string) {
    this.Toast.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}

import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor() {}

  showFire(icon: SweetAlertIcon, title: string, content: string, type: 'text' | 'html' = 'text', action?: () => void) {
    Swal.fire({
      icon,
      title,
      [type]: content
    }).then(() => {
      if (action) {
        action();
      }
    });
  }

  showFireConfirm(icon: SweetAlertIcon, confirm: string, cancel: string, title: string, content: string, type: 'text' | 'html' = 'text', action?: () => void){
    Swal.fire({
      title: title,
      [type]: content,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirm,
      cancelButtonText: cancel,
    }).then((result) => {
      if (result.isConfirmed && action) {
          action();
      }
    });
  } 

  showToast(icon: SweetAlertIcon, title: string, content: string, type: 'text' | 'html' = 'text', action?: () => void) {
    this.Toast.fire({
      icon,
      title,
      [type]: content
    }).then(() => {
      if (action) {
        action();
      }
    });
  }

  

}

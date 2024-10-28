import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { ApiServiceEmployees } from '../../../services/api.service.employees';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { VerifyCodeSms } from 'src/app/models/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private apiService: ApiServiceEmployees,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.apiService.login(credentials).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Verificación por SMS',
            html: `<p style="font-size: 15px;">${response.message}</p>`,
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off',
              required: 'true',
              placeholder: 'Código de verificación',
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            showLoaderOnConfirm: true,
            preConfirm: (code) => {
              if (!code) {
                Swal.showValidationMessage(
                  'Por favor, ingresa el código recibido por SMS.'
                );
              }
              return code;
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              /* Verify Code */
              const data = {
                code: Number(result.value),
                codeResend: response.code,
              };

              this.validCode(data)
                .then((res) => {
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: true,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    },
                  });
                  Toast.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Inicio de Sesión Éxitoso',
                  });
                  this.authService.saveSessionStorage(response);
                  this.router.navigate(['/dashboard']);
                })
                .catch((error) => {
                  const Toast = Swal.mixin({
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
                  Toast.fire({
                    icon: 'error',
                    title: 'Autenticación Fallida',
                    text: 'El Código de Autenticación ingresado es incorrecto, intentalo de nuevo',
                  });
                });
            } else {
              const Toast = Swal.mixin({
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
              Toast.fire({
                icon: 'error',
                title: 'Acción Cancelada',
                text: 'La autenticación por SMS es requerida, por favor, intentalo de nuevo.',
              });
            }
          });
        },
        error: (error) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Ocurrió un error al Iniciar Sesión.',
          });
        },
      });
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese correctamente la información',
      });
    }
  }

  validCode = (data: VerifyCodeSms): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.apiService.verifyCode(data).subscribe({
        next: (response) => {
          if (response.status) {
            resolve(true);
          } else {
            reject(true);
          }
        },
        error: () => {
          reject(false);
        },
      });
    });
  };
}

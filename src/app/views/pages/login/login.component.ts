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
import { SwalService } from '../../../services/swal.service';
import { UserService } from '../../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SocketService } from '../../../services/socket.service';
import { VerifyCodeSms } from '../../../models/interfaces';

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
    private swalService: SwalService,
    private userService: UserService,
    private socketService: SocketService
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
                data: response.data,
                temp: response.temp,
              };

              this.validCode(data)
                .then((res) => {
                  /* Temporary Session */
                  if (res.temp) {
                    const email = credentials.email;
                    this.router.navigate(['/forgotPassword'], {
                      state: { email },
                    });
                  } else {
                    this.swalService.showToast(
                      'success',
                      'Bienvenido',
                      res.message || 'Inicio de Sesión Éxitoso',
                      'text',
                      () => {}
                    );
                    /* Save Data */
                    this.saveDataSession(response.data);
                  }
                })
                .catch((error) => {
                  this.swalService.showToast(
                    'error',
                    'Autenticación Fallida',
                    error.error?.error ||
                      'El Código de Autenticación ingresado es incorrecto, intentalo de nuevo',
                    'text',
                    () => {}
                  );
                });
            } else {
              this.swalService.showToast(
                'error',
                'Acción Cancelada',
                'La autenticación por SMS es requerida, por favor, intentalo de nuevo.',
                'text',
                () => {}
              );
            }
          });
        },
        error: (error) => {
          this.swalService.showToast(
            'error',
            'Error',
            error.error?.message || 'Ocurrió un error al Iniciar Sesión.',
            'text',
            () => {}
          );
        },
      });
    } else {
      this.swalService.showToast(
        'error',
        'Error',
        'Por favor, ingrese correctamente la información',
        'text',
        () => {}
      );
    }
  }

  validCode = (data: VerifyCodeSms): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.apiService.verifyCode(data).subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  saveDataSession = (sessionEmployee: any): void => {
    sessionStorage.setItem('session-employee', JSON.stringify(sessionEmployee));
    this.router.navigate(['/dashboard']);
    this.socketService.connect();
  };

  goForgot() {
    this.router.navigate(['/forgotPassword']);
  }
}

import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { SwalService } from 'src/app/services/swal.service';

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
import { ApiServiceForgot } from '../../../services/api.service.Forgot';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotPassword.component.html',
  styleUrl: './forgotPassword.component.scss',
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
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiServiceForgot: ApiServiceForgot,
    private swalService: SwalService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const formValue = this.forgotPasswordForm.value;
      this.apiServiceForgot.recoverPassword(formValue).subscribe({
        next: (response) => {
          this.swalService.showToast(
            'success',
            response.message ||
              'Correo Enviado, favor de revisar su bandeja de mensajes',
            'text'
          );
        },
        error: (error) => {
          this.swalService.showToast(
            'error',
            error.error?.message || 'Ocurrió un error al enviar el correo.',
            'text'
          );
        },
      });
    } else {
      this.swalService.showToast(
        'warning',
        'Por favor, ingresa correctamente la información.',
        'text'
      );
    }
  }
}

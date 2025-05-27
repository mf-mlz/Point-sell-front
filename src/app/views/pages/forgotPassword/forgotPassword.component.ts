import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { SwalService } from '../../../services/swal.service';
import { Router } from '@angular/router';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

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
    NgxSpinnerModule
  ],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  type: string = '';
  title: string = '';
  instructions: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiServiceForgot: ApiServiceForgot,
    private swalService: SwalService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const emailFromState = history.state.email;
    this.type = emailFromState ? 'temporary' : 'forgot';
    this.title = emailFromState
      ? 'Cambiar contraseña'
      : 'Recuperación de contraseña';
    this.instructions = emailFromState
      ? 'Se detectó que su contraseña es temporal. Para restablecer su contraseña, debe proporcionar el correo con el que se registró. Le enviaremos un correo con un enlace seguro para crear una nueva contraseña.'
      : 'Para restablecer su contraseña, debe proporcionar el correo con el que se registró. Se le enviará un correo con un ENLACE para restablecer su contraseña.';

    if (emailFromState) {
      this.forgotPasswordForm.patchValue({ email: emailFromState });
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.spinner.show();
    if (this.forgotPasswordForm.valid) {
      const formValue = this.forgotPasswordForm.value;
      this.apiServiceForgot.recoverPassword(formValue).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.spinner.hide();
          this.swalService.showFire(
            'success',
            '¡Correo Enviado con Éxito!',
             response.message || 'Correo Enviado, favor de revisar su bandeja de mensajes'
          );
        },
        error: (error) => {
          this.isSubmitting = false;
          this.spinner.hide();
          this.swalService.showFire(
            'error',
            'No se puede realizar el envio',
            error.error?.message || 'Ocurrió un error al enviar el correo.'
          );
        },
      });
    } else {
      this.isSubmitting = false;
      this.spinner.hide();
      this.swalService.showToast(
        'warning',
        'Por favor, ingresa correctamente la información.',
        'text'
      );
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}

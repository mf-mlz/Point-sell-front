import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../../services/swal.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-reset-password',
  templateUrl: './resetPassword.component.html',
  styleUrl: './resetPassword.component.scss',
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
    NgxSpinnerModule,
  ],
})
export class ResetPasswordComponent {
  changePasswordForm: FormGroup;
  token: string = '';
  isSubmitting: boolean = false;

  private tkn: string;
  constructor(
    private fb: FormBuilder,
    private apiServiceForgot: ApiServiceForgot,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService,
    private spinner: NgxSpinnerService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        token: ['' /* , [Validators.required] */],
        pass1: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
    this.tkn = '';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const rawToken = params.get('token');
      if (rawToken) {
        this.token = decodeURIComponent(rawToken);
        this.changePasswordForm.get('token')?.setValue(this.token);
        console.log('Token recibido:', this.token);
      } else {
        this.onerror();
      }
    });
  }

  onSubmit() {
    this.spinner.show();
    this.isSubmitting = true;
    this.route.paramMap.subscribe((params) => {
      if (this.token !== '') {
        this.tkn = decodeURIComponent(this.token);
      } else {
        this.onerror();
      }
    });

    /* armado */
    this.changePasswordForm.value.token = this.tkn;

    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      const { pass1, password } = formValue;
      if (pass1 !== password) {
        this.isSubmitting = false;
        this.spinner.hide();
        this.swalService.showToast(
          'error',
          'Error',
          'Una de las contraseñas no coincide',
          'text'
        );
      }
      this.apiServiceForgot.changePassword(formValue).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.swalService.showFire(
            'success',
            'Contraseña actualizada con éxito',
            response.message || 'Contraseña modificada correctamente',
            'text',
            () => {
              this.router.navigate(['/login']);
            }
          );
        },
        error: (error) => {
          this.spinner.hide();
          this.swalService.showFire(
            'error',
            'Error',
            error.error?.message ||
              'Ocurrió un error al cambiar la contraseña.',
            'text',
            () => {
              this.router.navigate(['/login']);
            }
          );
        },
      });
    } else {
      this.spinner.hide();
      this.swalService.showFire(
        'warning',
        'Error',
        'Por favor, ingresa correctamente la información.'
      );
      this.isSubmitting = false;
    }
  }

  onerror() {
    this.spinner.hide();
    this.swalService.showFire(
      'error',
      'La URL no incluye un Token válido',
      'Falta el token en la URL'
    );
    this.router.navigate(['/login']);
  }

  public passwordMatchValidator(form: FormGroup) {
    return form.get('pass1')?.value === form.get('password')?.value
      ? null
      : { mismatch: true };
  }

  public getTkn(): string {
    return this.tkn;
  }
  public setTkn(params: string): void {
    this.tkn = params;
  }
}

import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ActivatedRoute, Router } from '@angular/router';
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
  ],
})

export class ResetPasswordComponent {
  changePasswordForm: FormGroup;

  private tkn: string;
  constructor(
    private fb: FormBuilder,
    private apiServiceForgot: ApiServiceForgot,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService
  ) {
    this.changePasswordForm = this.fb.group(
      {
        token: [''/* , [Validators.required] */],
        pass1: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
    this.tkn = "";
  }

  ngOnInit(): void { }

  onSubmit() {
    this.route.paramMap.subscribe(params => {
      const token: string = params.get('token') ?? "";
      if (token !== "") {
        this.tkn = decodeURIComponent(token);
      } else {
        this.swalService.showToast(
          'error',
          'Error',
          'Falta el token',
          'text'
        );        
      }
    });

    /* armado */
    this.changePasswordForm.value.token = this.tkn;
    /*  */
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      const { pass1, password } = formValue;
      if (pass1 !== password) {
        this.swalService.showToast(
          'error',
          'Error',
          'Una de las contraseñas no coincide',
          'text'
        );        
      }

      this.apiServiceForgot.changePassword(formValue).subscribe({
        next: (response) => {
          this.swalService.showFireConfirm(
            'success',
            'Aceptar',
            'Cancelar',
            'Confirmación',
            response.message || 'Contraseña modificada correctamente',
            'text',
            () => {
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1000);
            }
          );
          
        },
        error: (error) => {
          this.swalService.showFire(
            'error',
            'Error',
            error.error?.message || 'Ocurrió un error al cambiar la contraseña.'
          );          
        }
      });
    } else {
      this.swalService.showFire(
        'warning',
        'Error',
        'Por favor, ingresa correctamente la información.'
      );      
    }
  }

  public passwordMatchValidator(form: FormGroup) {
    return form.get('pass1')?.value === form.get('password')?.value
      ? null : { 'mismatch': true };
  }

  public getTkn(): string {
    return this.tkn;

  }
  public setTkn(params: string): void {
    this.tkn = params;
  }
}

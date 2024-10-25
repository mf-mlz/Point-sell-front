import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {
    this.changePasswordForm = this.fb.group(
      {
        token: ['', [Validators.required]],
        pass1: ['', [Validators.required]],
        password: ['', [Validators.required]]
      }
    );
    this.tkn = "";
  }

  ngOnInit(): void { }

  onSubmit() {
    this.route.paramMap.subscribe(params => {
      const token = params.get('token');
      this.tkn = token ? decodeURIComponent(token) : '';
      console.log(this.tkn);
      
    });

    /* armado */
    this.changePasswordForm.value.token = this.tkn;
    /*  */
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      const { pass1, password } = formValue;
      if (pass1 !== password) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            'una de las contraseñas no coincide',
        });
      }

      this.apiServiceForgot.changePassword(formValue).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Contraseña modificada correctamente',
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('Send Success');
            }
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al cambiar la contraseña.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Por favor, ingresa correctamente la información.',
      });
    }
  }


  public getTkn(): string {
    return this.tkn;

  }
  public setTkn(params: string): void {
    this.tkn = params;
  }
}

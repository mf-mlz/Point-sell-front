import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})

export class ValidationsFormService {
  /* Get Error Message */
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);

    if (control?.hasError('required')) {
      return 'El Campo es Requerido';
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Ingresa Mínimo ${minLength} Caracteres`;
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Ingresa Mínimo ${minLength} Caracteres`;
    } else if (control?.hasError('invalid')) {
      return `El Campo es Inválido`;
    } else if (control?.hasError('email')) {
      return 'Ingresa un correo válido';
    } else if (control?.hasError('pattern')) {
      return 'Ingresa únicamente números';
    } else if (control?.hasError('invalidTotal')) {
      return 'La Venta no puede ser de $0.00';
    }

    return '';
  }

  /* Verify Invalid Input */
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /* Prevent Not Press */
  preventInput(event: KeyboardEvent | Event): void {
    event.preventDefault();
  }
}

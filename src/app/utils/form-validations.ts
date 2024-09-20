import { FormGroup } from '@angular/forms';

/* Get Error Message */
export function getErrorMessage(form: FormGroup, field: string): string {
  const control = form.get(field);
  
  if (control?.hasError('required')) {
    return 'El Campo es Requerido';
  } else if (control?.hasError('minlength')) {
    const minLength = control.errors?.['minlength'].requiredLength;
    return `Ingresa Mínimo ${minLength} Caracteres`;
  } else if (control?.hasError('maxlength')) {
    const maxLength = control.errors?.['maxlength'].requiredLength;
    return `Ingresa Máximo ${maxLength} Caracteres`;
  } else if (control?.hasError('email')) {
    return 'Ingresa un correo válido';
  } else if (control?.hasError('pattern')) {
    return 'Ingresa únicamente números';
  }
  
  return '';
}

/* Verify Invalid Input */
export function isFieldInvalid(form: FormGroup, field: string): boolean {
  const control = form.get(field);
  return !!control && control.invalid && (control.dirty || control.touched);
}

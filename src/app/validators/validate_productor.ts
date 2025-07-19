import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarProductor(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cod = control.get('CodProductor')?.value;
    const nima = control.get('NIMAProductor')?.value;

    if (cod && !nima) {
      control.get('NIMAProductor')?.setErrors({ requerido: true });
    } else {
      // Limpia error si antes estaba marcado
      control.get('NIMAProductor')?.setErrors(null);
    }

    return null;
  };
}

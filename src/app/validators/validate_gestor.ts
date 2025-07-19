import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarGestor(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cod = control.get('CodGestor')?.value;
    const nima = control.get('NIMAGestor')?.value;

    if (cod && !nima) {
      control.get('NIMAGestor')?.setErrors({ requerido: true });
    } else {
      // Limpia error si antes estaba marcado
      control.get('NIMAGestor')?.setErrors(null);
    }

    return null;
  };
}

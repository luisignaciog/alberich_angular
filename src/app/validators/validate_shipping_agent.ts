import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validarShippingAgent(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cod = control.get('CodTransportista')?.value;
    const nima = control.get('NIMATransportista')?.value;

    if (cod && !nima) {
      control.get('NIMATransportista')?.setErrors({ requerido: true });
    } else {
      // Limpia error si antes estaba marcado
      control.get('NIMATransportista')?.setErrors(null);
    }

    return null;
  };
}

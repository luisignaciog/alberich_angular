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

export function alMenosUnoRequerido(campo1: string, campo2: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const control1 = form.get(campo1);
    const control2 = form.get(campo2);

    const valor1 = control1?.value;
    const valor2 = control2?.value;

    // Si la validación falla (ambos están vacíos)
    if (!valor1 && !valor2) {
      // Asignamos el error a cada control para que mat-error lo detecte
      control1?.setErrors({ alMenosUnoRequerido: true });
      control2?.setErrors({ alMenosUnoRequerido: true });
      // Devolvemos el error a nivel de grupo (buena práctica)
      return { alMenosUnoRequerido: true };
    }

    // Si la validación se cumple, limpiamos el error DE AMBOS controles
    // Es importante comprobar si el error existe antes de limpiarlo para evitar bucles infinitos.
    if (control1?.hasError('alMenosUnoRequerido')) {
      control1.setErrors(null);
    }
    if (control2?.hasError('alMenosUnoRequerido')) {
      control2.setErrors(null);
    }

    // Si la validación pasa, no hay error a nivel de grupo
    return null;
  };
}

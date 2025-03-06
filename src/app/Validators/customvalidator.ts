
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class Customvalidator {
}
// Custom validator: Ensure at least one checkbox is checked
export function atLeastOneCheckboxChecked(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedValues = control.value;
    if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      return null; // Valid if at least one checkbox is selected
    }
    return { required: true }; // Invalid if none are selected
  };
}

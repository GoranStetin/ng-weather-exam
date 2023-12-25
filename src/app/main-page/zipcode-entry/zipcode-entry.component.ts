import { Component } from '@angular/core';
import { LocationService } from "../../location.service";
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator function for US postal codes.
 * It returns a validation error object if the input is not a valid US postal code, otherwise null.
 */
export function usPostalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validZIP = /^\d{5}(-\d{4})?$/; // Regex pattern for validating US postal codes.
    if (control.value && !validZIP.test(control.value)) {
      return { 'usPostalCodeInvalid': true }; // Return an error object if the postal code is invalid.
    }
    return null; // Return null if there are no validation errors.
  };
}

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  // FormGroup to manage the postal code form control.
  form = new FormGroup({
    postalCode: new FormControl('', [usPostalCodeValidator()]) // Assign the usPostalCodeValidator to the postalCode FormControl.
  });

  // Injecting the LocationService.
  constructor(private service: LocationService) { }

  /**
   * Method to add a location using the LocationService.
   * It takes a string argument 'zipcode' and passes it to the addLocation method of the service.
   * 
   * @param {string} zipcode - The zipcode to add.
   */
  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }

}

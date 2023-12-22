import { Component } from '@angular/core';
import { LocationService } from "../../location.service";
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usPostalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validZIP = /^\d{5}(-\d{4})?$/;
    if (control.value && !validZIP.test(control.value)) {
      return { 'usPostalCodeInvalid': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  form = new FormGroup({
    postalCode: new FormControl('', [usPostalCodeValidator()])
  });

  constructor(private service: LocationService) { }

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }

}

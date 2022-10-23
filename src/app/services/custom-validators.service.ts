import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  private isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(Number(date));
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  startBeforeEnd(startKey: string, endKey: string, errorKey: string): ValidatorFn {
    return (formGroup: FormGroup) => {
      const startDate = formGroup.controls[startKey];
      const endDate = formGroup.controls[endKey];

      if (!startDate || !endDate) {
        return null;
      }
      if (!this.isValidDate(startDate) || !this.isValidDate(endDate)) {
        return null;
      } 
      if (endDate.errors && !endDate.errors.endBeforeStart) {
        return null;
      }
      
      if (startDate.value > endDate.value) {
        const obj = {}; obj[errorKey] = true;
        endDate.setErrors(obj);
      } else {
        endDate.setErrors(null);
      }
    }
  }

 

}

import { Component, ViewChild, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';

export class DateValidator {

  static validDate(fc: FormControl) {
    console.log(fc.value);
    if (fc.value === "abc123" || fc.value.toLowerCase() === "123abc") {
      return ({ validUsername: true });
    } else {
      return (null);
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.component.html'
})
export class PasswordConfirmationComponent {
  constructor(
    private router: Router) {
  }
  GoToLogin() {
    this.router.navigate(['/login']);
  }
}  


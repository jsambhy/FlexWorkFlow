import { NgModule } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PreLoginRoutingModule } from './preLogin-routing.module';
import { PasswordConfirmationComponent } from './Authentication/password-confirmation.component';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ForgotPasswordComponent } from './Authentication/forgot-password.component';
import { PasswordStrengthComponent } from './Authentication/password-strength.component';
import { ChangeSecurityQuestionsComponent } from './Authentication/change-security-questions.component';
import { PolicyAcceptanceComponent } from './Authentication/policy-acceptance.component';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './Authentication/reset-password.component';
import { SetPasswordComponent } from './Authentication/set-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckOTPComponent } from './Authentication/check-otp.component';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { DefaultRoleComponent } from './Authentication/default-role.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { MfaregistrationComponent } from './Authentication/mfaregistration.component';
import { MfaScreenComponent } from './Authentication/mfa-screen.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PreLoginRoutingModule,
    TextBoxModule, ToastModule,
    GridAllModule, GridModule, DropDownListModule,
    ButtonsModule.forRoot()
  ],
  declarations: [
    PasswordConfirmationComponent,
    ForgotPasswordComponent,
    PasswordStrengthComponent,
    ChangeSecurityQuestionsComponent,
    PolicyAcceptanceComponent,
    ResetPasswordComponent,
    SetPasswordComponent,
    CheckOTPComponent,
    DefaultRoleComponent,
    MfaregistrationComponent,
    MfaScreenComponent
  ]
})
export class PreLoginModule { }

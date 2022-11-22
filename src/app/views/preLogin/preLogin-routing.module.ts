import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordConfirmationComponent } from './Authentication/password-confirmation.component';
import { HttpModule } from '@angular/http';
import { PolicyAcceptanceComponent } from './Authentication/policy-acceptance.component';
import { ForgotPasswordComponent } from './Authentication/forgot-password.component';
import { ChangeSecurityQuestionsComponent } from './Authentication/change-security-questions.component';
import { ResetPasswordComponent } from './Authentication/reset-password.component';
import { SetPasswordComponent } from './Authentication/set-password.component';
import { CheckOTPComponent } from './Authentication/check-otp.component';
import { MfaregistrationComponent } from './Authentication/mfaregistration.component';
import { MfaScreenComponent } from './Authentication/mfa-screen.component';


const routes: Routes = [
  {
    path: '',
    component: PasswordConfirmationComponent,
  },
  {
    path: 'PolicyAcceptance/:UserId',
    component: PolicyAcceptanceComponent
  },
  {
    path: 'MFARegistration/:UserId/:Email/:PolicyAccepted',
    component: MfaregistrationComponent
  },
  {
    path: 'MFAScreen/:UserId/:SecretKey/:PolicyAccepted',
    component: MfaScreenComponent
  },
  {
    path: 'ForgotPassword/:Email',
    component: ForgotPasswordComponent
  },
  {
    path: 'SecurityQuestions/:UserId',
    component: ChangeSecurityQuestionsComponent
  },
  {
    path: 'PasswordConfirmation',
    component: PasswordConfirmationComponent
  },
  {
    path: 'ResetPassword/:Email/:UserId/:ProjectId',
    component: ResetPasswordComponent
  },
  {
    path: 'SetPassword/:Email/:UserId',
    component: SetPasswordComponent
  },
  {
    path: 'CheckOtp/:Email/:UserId',
    component: CheckOTPComponent
  },
];

@NgModule({
  imports: [
    HttpModule,
    RouterModule.forChild(routes)
    
  ],
  exports: [RouterModule]
})
export class PreLoginRoutingModule { }

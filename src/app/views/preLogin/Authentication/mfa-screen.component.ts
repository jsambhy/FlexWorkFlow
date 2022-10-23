import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AccountService } from '../../../services/auth';
const speakeasy = require('speakeasy');

@Component({
    selector: 'app-mfa-screen',
    templateUrl: './mfa-screen.component.html'
    
})
/** mfa-screen component*/
export class MfaScreenComponent {
  SecretKey: string;
  PolicyAccepted: boolean;
  UserId: number;
  //Email: string;

  constructor(private route: ActivatedRoute, private router: Router, private _AccountService: AccountService) {
    this.route.params.subscribe((params: Params) => {
      this.UserId = params['UserId'];
      //this.Email = params['Email'];
      this.SecretKey = params['SecretKey'];
      this.PolicyAccepted = JSON.parse(params['PolicyAccepted']);
    });
    }

  Verify(UserMFACode)
  {
    //Now verify the Token
    let verified = speakeasy.totp.verify({
      secret: this.SecretKey,
      encoding: 'ascii',
      token: UserMFACode
    });
    console.log(verified);
    if (verified) {
      //Check for policy Acceptance here
      if (!this.PolicyAccepted) {
        this._AccountService.GetPolicyText(this.UserId.toString())
          .subscribe(
            policytext => {
              if (policytext == null || policytext.length == 0) {//if no policy exists, move ahead
                this._AccountService.DecideLoginNavigation(this.UserId);
              } else {
                this.router.navigate(['/prelogin/PolicyAcceptance', this.UserId ]);
              }
            }
          );
      }
      else {
        this._AccountService.DecideLoginNavigation(this.UserId);
      }
      //if (!this.PolicyAccepted) {
      //  this.router.navigate(['/prelogin/PolicyAcceptance', this.UserId, this.Email]);
      //}
      //else {
      //  this._AccountService.DecideLoginNavigation(this.Email);
      //}
    }
    else
    {
      alert('You entered the wrong MFA');
    }
  }
}

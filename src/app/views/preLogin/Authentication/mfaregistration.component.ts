import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { bool } from 'aws-sdk/clients/signer';
import { PostSecretKeyModel } from '../../../models/postsecretkey.model';

const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

@Component({
    selector: 'app-mfaregistration',
    templateUrl: './mfaregistration.component.html',
  providers: [UserService]
})
/** MFARegistration component*/
export class MfaregistrationComponent {
  UserId: number;
  Email: string;
  qrcodeURL: string;
  secretKey: string;
  PolicyAccepted: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private _userService: UserService) {
    this.route.params.subscribe((params: Params) => {
      this.UserId = params['UserId'];
      this.Email = params['Email'];
      this.PolicyAccepted = params['PolicyAccepted'];
    });
  }

  ngOnInit()
  {
    this.SetMFA();
  }

  SetMFA() {
    let qrurl;
    //Generate Secret Key
    const secret = speakeasy.generateSecret({
      name: this.Email,//need to make changes for cognito since Email is not mandatory anymore
      lenght: 20
    })

    this.secretKey = secret.ascii;
    
    //get qrcodeURL, this code will show use to show qr image at front end
    qrcode.toDataURL(secret.otpauth_url, function (err, data_url) {
      console.log(data_url);
      qrurl = data_url;
    });
    this.qrcodeURL = qrurl;
  }

  SaveSecretAndUpdateMFA()
  {
    let model: PostSecretKeyModel = new PostSecretKeyModel();
    model.UserId = this.UserId;
    model.SecretKey = this.secretKey;
    this._userService.SaveSecretAndUpdateMFA(model)
      .subscribe(
        data => {
          this.router.navigate(["/prelogin/MFAScreen", this.UserId,this.secretKey, this.PolicyAccepted]);
        }
      );
  }
}

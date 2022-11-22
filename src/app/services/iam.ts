import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class IAMService { 
  private _message = new Subject<string>();
  _message$ = this._message.asObservable();
  constructor() {
  }

  SignIn(UserName, Password)  {
    console.log('signin method');
    Auth.signIn(UserName,Password).then(user => {
      console.log(user);
      //this._message.next(user);
      this._message.next('success');
      return user;
    })
      .catch(err => {
        console.log(err)
        this._message.next(err.Message);
        return err ;
      });
    
  }

}




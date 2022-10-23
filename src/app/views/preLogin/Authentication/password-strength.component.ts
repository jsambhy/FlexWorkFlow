import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../services/auth';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() public passwordToCheck: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;

  ProjectId: number;
  MinLowerCase: number = 1
  MinUpperCase: number = 1;
  MinNumbers: number = 1;
  MinSpecialChars: number = 1;
  MinLength: number = 8;

  constructor(private _service: AccountService, private route: ActivatedRoute) {
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {  
      this.ProjectId = +params['ProjectId'];
    });
    //get passwordPolicies from database
    this._service.GetPasswordPolicyByProjectId(this.ProjectId).subscribe(policies => {
      this.MinLowerCase = policies.MinLowerCase;
      this.MinUpperCase = policies.MinUpperCase;
      this.MinNumbers = policies.MinNumbers;
      this.MinSpecialChars = policies.MinSpecialChars;
      this.MinLength = policies.MinLength;
    })
  }
  msg = '';
  //private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0']; 
  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];

  //private static checkStrength(p) {
  //  let force = 0;
  //  const regex = /[$-/#:-?{-~!"^_@`\[\]]/g;

  //  const lowerLetters = /[a-z]+/.test(p);
  //  const upperLetters = /[A-Z]+/.test(p);
  //  const numbers = /[0-9]+/.test(p);
  //  const symbols = regex.test(p);

  //  const flags = [lowerLetters, upperLetters, numbers, symbols];

  //  let passedMatches = 0;
  //  for (const flag of flags) {
  //    passedMatches += flag === true ? 1 : 0;
  //  }

  //  force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
  //  force += passedMatches * 10;

  //  // short password
  //  force = (p.length < 6) ? Math.min(force, 10) : force;

  //  // poor variety of characters
  //  force = (passedMatches === 1) ? Math.min(force, 10) : force;
  //  force = (passedMatches === 2) ? Math.min(force, 20) : force;
  //  force = (passedMatches === 3) ? Math.min(force, 30) : force;
  //  force = (passedMatches === 4) ? Math.min(force, 40) : force;

  //  return force;
  //}
  private   measureStrength(pass: string) {
     let score = 0;
    //// award every unique letter until 5 repetitions  
    //let letters = {};
    //for (let i = 0; i < pass.length; i++) {
    //  letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    //  score += 5.0 / letters[pass[i]];
    //}
    // bonus points for mixing it up  
      
    const lowerLetters = pass.replace(/[^a-z]/g, "").length >= this.MinLowerCase ? true : false; 
    let  numbers;
    let digitsInstring = pass.match(/[0-9]/g);
    if (digitsInstring != null) {
      numbers = digitsInstring.length >= this.MinNumbers ? true : false;
    } 
    //const numbers = pass.replace(/[0-9]/g, "").length >= this.MinNumbers ? true : false;
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    let symbolInstring = pass.match(regex);
    let symbols = false;
    if (symbolInstring != null) {
      symbols = symbolInstring.length >= this.MinSpecialChars ? true : false;
    } 
    const upperLetters = pass.replace(/[^A-Z]/g, "").length >= this.MinUpperCase ? true : false;

    let variations = [lowerLetters, upperLetters, numbers, symbols];

    let variationCount = 0;
    for (let check in variations) { 
      variationCount += (variations[check]) ? 1 : 0; 
    }
 
    //score += (variationCount - 1) * 10;
 
    //return Math.trunc(score);

       

    score += 2 * pass.length + ((pass.length >= this.MinLength) ? 1 : 0);
    score += variationCount * 10;

    // short password
    score = (pass.length < 6) ? Math.min(score, 10) : score;

    // poor variety of characters
    score = (variationCount === 1) ? Math.min(score, 10) : score;
    score = (variationCount === 2) ? Math.min(score, 20) : score;
    score = (variationCount === 3) ? Math.min(score, 30) : score;
    score = (variationCount === 4) ? Math.min(score, 40) : score;

    return score;

  }  
  //ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
  //  
  //  const password = changes.passwordToCheck.currentValue;
  //  this.setBarColors(4, '#DDD');
  //  if (password) {
  //    const c = this.getColor(PasswordStrengthComponent.checkStrength(password));
  //    this.setBarColors(c.idx, c.col);

  //    const pwdStrength = PasswordStrengthComponent.checkStrength(password);
  //    pwdStrength === 40 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

  //    switch (c.idx) {
  //      case 1:
  //        this.msg = 'Poor';
  //        break;
  //      case 2:
  //        this.msg = 'Not Good';
  //        break;
  //      case 3:
  //        this.msg = 'Average';
  //        break;
  //      case 4:
  //        this.msg = 'Good';
  //        break;
  //    }
  //  } else {
  //    this.msg = '';
  //  }
  //}

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    var password = changes['passwordToCheck'].currentValue;
    this.setBarColors(4, '#DDD');
    if (password) {
      let pwdStrength = this.measureStrength(password); 
      let c = this.getColor(pwdStrength);
      this.setBarColors(c.idx, c.col);
      pwdStrength === 40  ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);
    }
  }
//  private setBarColors(count, col) {
//    for (let _n = 0; _n < count; _n++) {
//      this['bar' + _n] = col;
//    }
//  } 
//  private getColor(score: number) { 
//    let idx = 0; 
//    if (score > 80) { 
//      idx = 4; 
//    } else if (score > 70) { 
//      idx = 3; 
//    } else if (score >= 40) { 
//      idx = 2; 
//    } else if (score >= 20) { 
//      idx = 1; 
//    } 
//    return {
//    idx: idx + 1,
//    col: this.colors[idx]
//  };
//}  

  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else if (s <= 20) {
      idx = 1;
    } else if (s <= 30) {
      idx = 2;
    } else if (s <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx]
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }

}



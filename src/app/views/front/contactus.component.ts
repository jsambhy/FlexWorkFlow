import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
/** demo_request component*/
export class ContactUsComponent {
    /** demo_request ctor */
  constructor(public router: Router) {
    
  }

  LoginPage() {
    this.router.navigate(['login']);
  }


  //Back() {
  //  this.router.navigate(['front']);
  //}
  
}

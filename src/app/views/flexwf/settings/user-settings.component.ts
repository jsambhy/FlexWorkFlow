import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  Id: string;
  Email: string;
  //Define an array of JSON data
  public data: Object[] = [{ "text": "Change Password", "id": "changePwd" },
    { "text": "Change Security Questions", "id": "changeQuestion" }];
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.Id = sessionStorage.getItem("LoggedInUserId");
    this.Email = sessionStorage.getItem("LoginEmail");
  }

  ngOnInit() {
  }
  
}  

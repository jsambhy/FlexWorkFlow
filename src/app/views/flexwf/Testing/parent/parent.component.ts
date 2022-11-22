import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-parent',
    templateUrl: './parent.component.html',
    styleUrls: ['./parent.component.css']
})
/** Parent component*/
export class ParentComponent {
  Name: string="Namita";
  City: string = "Delhi";
 
  constructor(private router: Router) {

    }
  ngOnInit() {
    let Navigation = "NavigationValue";
    this.router.navigate(['/flexwf/Child', Navigation]);
  }

  PostEvent(val) {
    
    //console.log(val);
    console.log(val.Value1);
    console.log(val.Value2);
  }
}

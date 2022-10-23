import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html'
  //styleUrls: ['./child.component.css']
})
/** Child component*/
export class ChildComponent {

  @Input() Name: string;
  @Input() City: string;
  Navigation: string;
  //@Output() PostEvent = new EventEmitter<string>();
  @Output() PostEvent = new EventEmitter<object>();
  constructor(private route: ActivatedRoute) {

  }
  ngOnInit() {
    //console.log("Inside Child Component");
    //console.log("Name:- " + this.Name);
    //console.log("City:- " + this.City);

    this.route.params.subscribe((params: Params) => {
      this.Navigation = params['Navigation'];
    });

    console.log("Through Router:" + this.Navigation);

    //this.PostEventMethod();
    
  }

  PostEventMethod() {
    //this.PostEvent.emit("SingleValue");
    this.PostEvent.emit({ Value1: "Val1", Value2: "Val2"});
}
}

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
/** card component*/
export class CardComponent {
  @Input() passcounts: any;
  @Input() cardLabel: string; 
    /** card ctor */
    constructor() {

    }

  ngOnInit() {
    
    if (this.passcounts === "Null" ) {
      this.passcounts = 0;
    }
  }
}

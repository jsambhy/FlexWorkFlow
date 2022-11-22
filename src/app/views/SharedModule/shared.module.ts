import { NgModule} from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { WhereClauseComponent } from './where-clause/where-clause.component';
import { SharedRoutingModule } from './shared.routing';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { RadioButtonModule, SwitchAllModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DateTimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PivotComponent } from './pivot/pivot.component';
import {  DialogModule } from '@syncfusion/ej2-angular-popups';
import { GridModule } from '@syncfusion/ej2-angular-grids';

import { TabModule, MenuModule, MenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  imports: [
    FormsModule, ReactiveFormsModule, CommonModule,
    SharedRoutingModule,
    TextBoxModule, ToastModule, RadioButtonModule, DateTimePickerModule, DatePickerModule,
    DropDownListModule, DialogModule, GridModule, TabModule, NumericTextBoxModule,
    ButtonsModule.forRoot()
  ],
  declarations: [WhereClauseComponent, PivotComponent],
  exports: [WhereClauseComponent,
    CommonModule, FormsModule, PivotComponent, TabModule]

})
export class SharedModule { }

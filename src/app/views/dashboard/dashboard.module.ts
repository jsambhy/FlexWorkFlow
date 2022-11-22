import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { SidebarModule, TabModule, MenuModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ButtonAllModule, RadioButtonModule, ButtonModule, CheckBoxModule, SwitchAllModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { AutoCompleteModule, DropDownListModule, MultiSelectModule, ComboBoxModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
//import { MapsAllModule } from '@syncfusion/ej2-angular-maps';
import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

import { DialogComponent, TooltipModule, DialogModule } from '@syncfusion/ej2-angular-popups';
import { HttpClientModule } from '@angular/common/http';
import { SliderModule, TextBoxModule, NumericTextBoxModule, ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { DateTimePickerModule, TimePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { ConfigureDashboardComponent } from './configure-dashboard/configure-dashboard.component';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { CardComponent } from './card/card.component';
import { BarComponent } from './bar/bar.component';
import { ChartComponent } from './chart/chart.component';

import { PivotViewComponent, PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { DashboardWidgetComponent } from './dashboard-widget/dashboard-widget.component';
import { ConfigureDashboardRenderComponent } from './configure-dashboard/configure-dashboard-render/configure-dashboard-render.component';
import { ConfigureDashboardDesignComponent } from './configure-dashboard/configure-dashboard-design/configure-dashboard-design.component';
import { SharedModule } from '../SharedModule/shared.module';
import { GridComponent } from './grid/grid.component';
import { Dummy_pivotComponent } from './dummy_pivot/dummy_pivot.component';
import { PivotViewsComponent } from './pivot-views/pivot-views.component';

@NgModule({
  providers: [DatePipe

  ],
  imports: [
    SharedModule,
    FormsModule, TooltipModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    DialogModule, TabModule, TextBoxModule, DropDownListModule,
    ButtonModule, CheckBoxModule, RadioButtonModule, DatePickerModule,
    DateTimePickerModule, TimePickerModule,
    MenuModule, ToolbarModule, ComboBoxModule, ToastModule, NumericTextBoxModule, MultiSelectModule,
    ColorPickerModule, ChartAllModule, AccumulationChartModule, PivotViewModule,
    FormsModule, DashboardLayoutModule, SidebarModule,
    CommonModule, ReactiveFormsModule, GridModule, SwitchAllModule, SwitchModule,
    ButtonsModule.forRoot()
  ],
  declarations: [DashboardComponent, ConfigureDashboardComponent,
    CardComponent, BarComponent, ChartComponent, DashboardWidgetComponent, ConfigureDashboardRenderComponent, ConfigureDashboardDesignComponent, GridComponent, Dummy_pivotComponent, PivotViewsComponent],
   
})
export class DashboardModule { }

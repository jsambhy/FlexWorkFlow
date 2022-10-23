import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { DialogComponent, TooltipModule, DialogModule } from '@syncfusion/ej2-angular-popups';

import { HttpModule } from '@angular/http';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
  
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './views/login/signup.component';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { DirectAccessGuard } from './services/authorizable.service';
import { FrontComponent } from './views/front/front.component';
import { ContactUsComponent } from './views/front/contactus.component';

import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DateTimePickerModule, DatePickerModule, DateRangePickerModule} from '@syncfusion/ej2-angular-calendars';

import { ReportService } from './services/report.service';

import { UserService } from './services/user.service';
import { ReportPivotViewsService } from './services/reportpivotviews.service';
import { SharedModule } from './views/SharedModule/shared.module';





@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    GridAllModule,
    HttpModule,
    DropDownListModule,
   //synfusion
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    TextBoxModule, ToastModule, RadioButtonModule, DateTimePickerModule, DateRangePickerModule, DatePickerModule,SharedModule,
    CarouselModule.forRoot()
    
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    SignUpComponent,
    FrontComponent,
    ContactUsComponent
  ],
  providers: [ThemeService, ReportService, ReportPivotViewsService, UserService,
    DirectAccessGuard,
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
    
  }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }

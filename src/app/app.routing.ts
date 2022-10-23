import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { SignUpComponent } from './views/login/signup.component';
import { FrontComponent } from './views/front/front.component';
import { ContactUsComponent } from './views/front/contactus.component';
import { PivotComponent } from './views/SharedModule/pivot/pivot.component';




export const routes: Routes = [
  {
    path: '',
   // redirectTo: 'dashboard',
   // redirectTo: 'login',
    redirectTo: 'front',
    pathMatch: 'full',
  },
  {
    path: 'front',
    component: FrontComponent,
    data: {
      title: 'Front Page'
    }
  },
  
  {
    path: 'contactus',
    component: ContactUsComponent,
    data: {
      title: 'ContactUs Page'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
 
  {
    path: 'signup',
    component: SignUpComponent,
    data: {
      title: 'Sign Up User'
    }
  },
  {
    path: '',
    //component: DefaultLayoutComponent,
    children: [
      {
        path: 'prelogin',
        loadChildren: () => import('./views/preLogin/preLogin.module').then(m => m.PreLoginModule)
      },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'flexwf',
        loadChildren: () => import('./views/flexwf/flexwf.module').then(m => m.FlexWFModule)
      },
      //{
      //  path: 'base',
      //  loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      //},
      //{
      //  path: 'buttons',
      //  loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      //},
      //{
      //  path: 'charts',
      //  loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      //},
      {
        path: 'pivot',
        component: PivotComponent,
        data: {
          title: 'pivot'
        }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      
      //{
      //  path: 'icons',
      //  loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      //},
      //{
      //  path: 'notifications',
      //  loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      //},
      //{
      //  path: 'theme',
      //  loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      //},
      //{
      //  path: 'widgets',
      //  loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      //},
     
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
 // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

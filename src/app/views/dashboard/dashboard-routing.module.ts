import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

import { ConfigureDashboardComponent } from './configure-dashboard/configure-dashboard.component';
/*import { Dummy_pivotComponent } from './dummy_pivot/dummy_pivot.component';*/


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: {
      title: ''
    }
  },
  {
    path: 'dash/:UserRoleId',
    component: DashboardComponent,
    data: {
      title: ''
    }
  },
  {
    path: 'configure-dashboard',
    component: ConfigureDashboardComponent,
    data: {
      title: ''
    }
  },
  //{
  //  path: 'pivot',
  //  component: Dummy_pivotComponent,
  //  data: {
  //    title: ''
  //  }
  //},
  //{
  //  path: 'design-dashboard',
  //  component: DesignDashboardComponent,
  //  data: {
  //    title: ''
  //  }
  //}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}

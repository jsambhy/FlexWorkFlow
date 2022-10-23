import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './Roles/roles.component';
import { UsersComponent } from './Users/users.component';
import { FormLabelsComponent } from './form-labels/form-labels.component';
import { MenuRoleMappingComponent } from './menu-role-mapping/menu-role-mapping.component';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { GenericGridComponent } from './generic-grid/generic-grid.component';

import { FlexworkflowsComponent } from './flex-workflows/flex-workflows.component';
import { WorkflowDiagramComponent } from './workflow-diagram/workflow-diagram.component';
import { UserSettingsComponent } from './settings/user-settings.component';

import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { FlexUploaderComponent } from './Uploader/uploader.component';
import { ReferencesComponent } from './master-data/references.component';
import { DirectAccessGuard } from '../../services/authorizable.service';
import { ReferenceDataComponent } from './master-data/reference-data.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ShowImageComponent } from './POC/show-image.component';
import { RestrictedColumnsComponent } from './restricted-columns-mapping/restricted-columns.component';
import { EntityConfigurationComponent } from './entity-configuration/entity-configuration.component';
import { TransactionUploadComponent } from './TransactionUploader/transaction-uploader.component';
import { FormdesignerComponent } from './formdesigner/formdesigner.component';
import { EntityFormsComponent } from './formdesigner/entityforms.component';
import { MappingDFsComponent } from './mapping-dfs/mapping-dfs.component';
import { ReportsComponent } from './custom-reports/reports.component';
import { ViewReportComponent } from './custom-reports/view-report.component';
import { CreateCognitoUserComponent } from './CreateCognitoUser/create-cognito-user.component';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { ValidationsComponent } from './validations/validations.component';
import { ValidationRulesComponent } from './validation-rules/validation-rules.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ParentComponent } from './Testing/parent/parent.component';
import { ChildComponent } from './Testing/Child/child.component';

/*import { Dummy_pivotComponent } from '../dashboard/dummy_pivot/dummy_pivot.component';*/



const routes: Routes = [
  {
    path: '',
    data: {
      title: ''
    },
    children: [

      {
        path: 'upload',
        component: FlexUploaderComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'uplaod'
        }
      },
      {
        path: 'Parent',
        component: ParentComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'uplaod'
        }
      },
      {
        path: 'Child',
        component: ChildComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'uplaod'
        }
      },
      {
        path: 'Child/:Navigation',
        component: ChildComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'uplaod'
        }
      },
      {
        path: 'master-data',
        component: ReferencesComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Master Data'
        }
      },
      {
        path: 'roles',
        component: RolesComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'user-upload',
        component: UserUploadComponent,
        data: {
          title: 'User Upload'
        }
      },
      {
        path: 'restricted-columns',
        component: RestrictedColumnsComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Restricted Columns'
        }
      },
      {
        path: 'form-labels/:EntityType/:EntityId',
        component: FormLabelsComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Manage Data Fields'
        }
      },
      {
        path: 'mapDfs',
        component: MappingDFsComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Map Data Fields'
        }
      },
      //{
      //  path: 'ColConfig/:EntityType/:EntityId',
      //  component: FormLabelsComponent,
      //  canActivate: [DirectAccessGuard],
      //  data: {
      //    title: 'Roles'
      //  }
      //},
      {
        path: 'users/:SourceEntityType',
        component: UsersComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Users'
        }
      },
      {
        path: 'MenuRoleMapping',
        component: MenuRoleMappingComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'MenuRoleMapping'
        }
      },
      {
        path: 'entity-configuration',
        component: EntityConfigurationComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Configuration'
        }
      },
      {
        path: 'create-cognito',
        component: CreateCognitoUserComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'CognitoUser'
        }
      },
      {
        path: 'form-renderer/:TransactionId/:StepId/:Mode/:Source/:SourceId/:FormId',
        component: FormRendererComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'form-renderer'
        }
      },
      {
        path: 'form-renderer/:TransactionId/:StepId/:Mode/:Source/:SourceId/:DatafieldId/:DatafieldValue',
        component: FormRendererComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'form-renderer'
        }
      },
      { 
        path: 'entityforms/:EntityType/:EntityId',
        component: EntityFormsComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Forms'
        },
      },
      {
        path: 'form-designer/:EntityType/:EntityId/:FormId',
        component: FormdesignerComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'FormDesigner'
        },
      },
      {
        
        path: 'generic-grid/:WorkflowId',
        component: GenericGridComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Workflows'
        },
      },
      
     
      {
        path: 'email-template',
        component: EmailtemplateComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Email Template'
        },
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Notifications'
        },
      },
      {
        path: 'flexworkflows',
        component: FlexworkflowsComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Flex Workflows'
        }
      },
      {
        path: 'diagramconfiguration/:Id/:FlexTableId/:UILabel',
        component: WorkflowDiagramComponent
        //canActivate: [DirectAccessGuard],
      },
      {
        path: 'TransactionUpload/:EntityType/:EntityId/:ProjectId/:underlyingEntityId',
        component: TransactionUploadComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Upload Transactions'
        },
      },
      {
        path: 'RefData/:ReferenceId/:ShowEdit',
        component: ReferenceDataComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Manage Data'
        },
      }, 
      {
        path: 'UserSettings',
        component: UserSettingsComponent,
        canActivate: [DirectAccessGuard],
        data: {
          title: 'Settings'
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Reports'
        },
      },

      {
        path: 'viewreport/:Id/:Source',
        component: ViewReportComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Reports'
        },
      },

      {
        path: 'scheduler/:ReportGroupId',
        component: SchedulerComponent,
        //canActivate: [DirectAccessGuard],
        data: {
          title: 'Scheduler'
        },
      },
      //{
      //  path: 'scheduler',
      //  component: SchedulerComponent,
      //  //canActivate: [DirectAccessGuard],
      //  data: {
      //    title: 'Scheduler'
      //  },
      //},

      {
        path: 'POC',
        component: ShowImageComponent,
        data: {
          title: 'Poc'
        },
      },
      {
        path: 'tagCategories',
        component: TagCategoryComponent,
        data: {
          title: 'tagCategories'
        }
      },
      {
        path: 'validations',
        component: ValidationsComponent,
        data: {
          title: 'validations'
        }
      },
      {
        path: 'validation-rules',
        component: ValidationRulesComponent,
        data: {
          title: 'Validations Rules'
        }
      },
      {
        path: 'announcements',
        component: AnnouncementComponent,
        data: {
          title: 'Announcements'
        }
      },
      //{
      //  path: 'pivot',
      //  component: PivotComponent,
      //  data: {
      //    title: 'pivot'
      //  }
      //},
      //{
      //  path: 'PivotCharts',
      //  component: Dummy_pivotComponent,
      //  data: {
      //    title: 'pivot'
      //  },
      //},
    ]
  }
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlexWFRoutingModule {}

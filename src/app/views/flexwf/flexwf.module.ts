// Angular
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RolesComponent } from './Roles/roles.component';
import { UsersComponent } from './Users/users.component'
import { GridModule, PagerModule } from '@syncfusion/ej2-angular-grids';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { DiagramModule, DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';
import { TextBoxModule, NumericTextBoxModule, UploaderModule, SliderModule, UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule, MultiSelectModule, ComboBoxModule, ListBoxModule, ListBoxComponent, AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { RadioButtonModule, SwitchAllModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerAllModule, DateTimePickerModule, DateTimePickerAllModule, TimePickerModule ,DateRangePickerModule} from '@syncfusion/ej2-angular-calendars';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { TabModule, MenuModule, MenuAllModule } from '@syncfusion/ej2-angular-navigations';
import { FormLabelsComponent } from './form-labels/form-labels.component';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/auth';
import { MenuRoleMappingComponent } from './menu-role-mapping/menu-role-mapping.component';
import { MenuRoleService } from '../../services/menu-role.service';
import { ProjectConfigurationComponent } from './project-configuration/project-configuration.component';
import { ProjectService } from '../../services/project.service';
import { FormRendererService } from '../../services/form-renderer.service';
import { FormRendererComponent } from './form-renderer/form-renderer.component';
import { RworkFlowsService } from '../../services/rworkflows.service';
import { FormDesignerService } from '../../services/form-designer.service';

import { GenericGridService } from '../../services/generic-grid.service';
import { GenericGridComponent } from './generic-grid/generic-grid.component';
import { WorkflowdesignerService } from '../../services/workflowdesigner.service';
import { EmailTemplateService } from '../../services/email-template.service';
import { FlexWorkflowsService } from '../../services/flex-workflows.service';
import { FlexworkflowsComponent } from './flex-workflows/flex-workflows.component';
import { WorkflowDiagramComponent } from './workflow-diagram/workflow-diagram.component';
import { BranchService } from '../../services/branch.service';
import { StepActionsService } from '../../services/step-actions.service';
import { StepColumnsComponent } from './step-columns/step-columns.component';
import { StepColumnsService } from '../../services/step-columns.service';
import { BranchComponent } from './branch/branch.component';
import { WFValidationService } from '../../services/workflow-validation.service';
import { WorkflowValidationComponent } from './workflow-validation/workflow-validation.component';
import { StepActionsParticipantsComponent } from './step-actions-participants/step-actions-participants.component';
import { StepParticipantsComponent } from './step-participants/step-participants.component';
import { StepActionsComponent } from './step-actions/step-actions.component';
import { WorkflowActionsComponent } from './workflow-actions/workflow-actions.component';
import { CalculationsComponent } from './calculations/calculations.component';
import { FlexWFRoutingModule } from './flexwf-routing.module';
import { UserSettingsComponent } from './settings/user-settings.component';
//import { FlexNotificationsComponent } from './flex-notifications/flex-notifications.component';
import { UsersCommonControlsComponent } from './user-common-controls/user-common-controls.component';
import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { RecipientsComponent } from './recipients/recipients.component';
import { FlexUploaderComponent } from './Uploader/uploader.component';
import { MasterDataService } from '../../services/master-data.service';
import { ReferenceDataComponent } from './master-data/reference-data.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RolesService } from '../../services/roles.service';
import { SupportingDocComponent } from './supporting-doc/supporting-doc.component';
import { SupportingDocumentService } from '../../services/supporting-document.service';
import { ShowImageComponent } from './POC/show-image.component';
import { CustomValidatorsService } from '../../services/custom-validators.service';
import { ConstraintsComponent } from './constraints/constraints.component';
import { RestrictedColumnsComponent } from './restricted-columns-mapping/restricted-columns.component';
import { ReferencesComponent } from './master-data/references.component';
import { CommonFormRendererComponent } from './common-form-renderer/common-form-renderer.component';
import { EntityConfigurationComponent } from './entity-configuration/entity-configuration.component';
import { EntityConfigurationService } from '../../services/entity.configuration.service';
import { TransactionUploadComponent } from './TransactionUploader/transaction-uploader.component';
import { FormdesignerComponent } from './formdesigner/formdesigner.component';
import { EntityFormsComponent } from './formdesigner/entityforms.component';
import { WorkflowParticipantsComponent } from './workflow-participants/workflow-participants.component';
import { MappingDFsComponent } from './mapping-dfs/mapping-dfs.component';
import { SubProcessService } from '../../services/subprocess.service';
import { SubProcessesComponent } from './sub-processes/sub-processes.component';
import { ReportsComponent } from './custom-reports/reports.component';

import { ReportService } from '../../services/report.service';
import { ViewReportComponent } from './custom-reports/view-report.component';
import { CreateCognitoUserComponent } from './CreateCognitoUser/create-cognito-user.component';
import { CategoryService, LegendService, TooltipService } from '@syncfusion/ej2-angular-charts';
import { DataLabelService, LineSeriesService } from '@syncfusion/ej2-angular-charts';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { SharedModule } from '../SharedModule/shared.module';
import { TagsComponent } from './tags/tags.component';
import { TagsService } from '../../services/tag.service';
import { TagCategoryComponent } from './tag-category/tag-category.component';
import { ValidationsComponent } from './validations/validations.component';
import { ValidationsService } from '../../services/validations.service';
import { ValidationRulesComponent } from './validation-rules/validation-rules.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementsService } from '../../services/announcements.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { GKeyValueService } from '../../services/gkeyvalue.service';
import { PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { ReportPivotViewsComponent } from './report-pivot-views/report-pivot-views.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { CustomReportParametersComponent } from './custom-report-parameters/custom-report-parameters.component';
import { ParentComponent } from './Testing/parent/parent.component';
import { ChildComponent } from './Testing/Child/child.component';
import { RepresentativesComponent } from './representatives/representatives.component';
import { RepresentativeService } from '../../services/representative.service';
import { HierarchyComponent } from './hierarchy/hierarchy.component';


@NgModule({
  providers: [
    UserService,
    AccountService,
    MenuRoleService,
    ProjectService,
    FormRendererService,
    RworkFlowsService,
    FormDesignerService,
    GenericGridService,
    WorkflowdesignerService,
    EmailTemplateService,
    FlexWorkflowsService,
    BranchService,
    StepActionsService,
    StepColumnsService,
    WFValidationService,
    RolesService,
    EntityConfigurationService,
    MasterDataService,
    SupportingDocumentService,
    CustomValidatorsService,
    SubProcessService,
    ReportService,
    TagsService,
    ValidationsService,
    AnnouncementsService,
    CategoryService,
    LegendService,
    TooltipService,
    DataLabelService,
    LineSeriesService,
    GKeyValueService,
    DatePipe,
    RepresentativeService    
  ],
  imports: [
    NgxSpinnerModule , 
    CommonModule, SharedModule,
    FlexWFRoutingModule, 
    GridModule, PagerModule,
    NumericTextBoxModule,
    TextBoxModule, DropDownListModule, FormsModule, ReactiveFormsModule, DialogModule, DatePickerAllModule, ToastModule, AutoCompleteModule, 
    UploaderModule, RichTextEditorAllModule, TabModule, CheckBoxModule, RadioButtonModule, SwitchAllModule, SwitchModule,
    DateTimePickerModule,DateRangePickerModule, DateTimePickerAllModule, TimePickerModule, MultiSelectModule, DiagramModule, DiagramAllModule,
    SymbolPaletteAllModule, OverviewAllModule, ComboBoxModule, SliderModule, MenuModule, MenuAllModule, ListBoxModule,
    DashboardLayoutModule, PivotViewModule
  ],
  declarations: [
    RolesComponent, UsersComponent, FormLabelsComponent, RolesComponent, MenuRoleMappingComponent,
    ProjectConfigurationComponent, FormRendererComponent, GenericGridComponent,
    FlexworkflowsComponent, WorkflowDiagramComponent, StepColumnsComponent, BranchComponent, WorkflowValidationComponent,
    StepActionsParticipantsComponent, StepParticipantsComponent, StepActionsComponent, WorkflowActionsComponent, CalculationsComponent,
    UsersCommonControlsComponent, EmailtemplateComponent, ReferenceDataComponent,
    UserSettingsComponent, RecipientsComponent, FlexUploaderComponent, ReferencesComponent,
    NotificationsComponent, SupportingDocComponent, ShowImageComponent, TransactionUploadComponent
    , ConstraintsComponent, RestrictedColumnsComponent, CommonFormRendererComponent, EntityConfigurationComponent
    , FormdesignerComponent, EntityFormsComponent, WorkflowParticipantsComponent, MappingDFsComponent, SubProcessesComponent,
    ReportsComponent, ViewReportComponent, CreateCognitoUserComponent, UserUploadComponent, TagsComponent,
    TagCategoryComponent, ValidationsComponent, ValidationRulesComponent, AnnouncementComponent,
    ReportPivotViewsComponent, SchedulerComponent, CustomReportParametersComponent, ParentComponent, ChildComponent, RepresentativesComponent, HierarchyComponent]
  
})
export class FlexWFModule { }

import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RWorkFlows } from '../../../models/rworkflow-model';
import { FormDesignerService } from '../../../services/form-designer.service';
import { FormRendererService } from '../../../services/form-renderer.service';
import { RworkFlowsService } from '../../../services/rworkflows.service';
import { UserService } from '../../../services/user.service';

import { GridComponent, PageSettingsModel, FilterSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { FlexTableDataModel, JsonModelForSP, ReferenceDataModel } from '../../../models/flex-entity-model';
import { MasterDataService } from '../../../services/master-data.service';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { DataFieldService } from '../../../services/data-fields.service';
import { environment } from '../../../../environments/environment';
import { Ajax } from '@syncfusion/ej2-base';
@Component({
    selector: 'app-form-renderer',
    templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.css'],
  providers: [DataFieldService]
})


export class FormRendererComponent {
  FormMode: string;
  
  underlyingTableName: string;
  flexDataModel: FlexTableDataModel;
  refDataModel: ReferenceDataModel;
  ColumnConfigurationArray: any;
  EntityType: string;
  EntityId: number;
  ProjectId: number;
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  UserRoleId: number = +sessionStorage.getItem("UserRoleId");
  //WorkFlowId: string;
  WorkFlowDetails: RWorkFlows;
  DatafieldId: number;
  DatafieldValue: number;
  FormId: number;
  readonly baseUrl = environment.baseUrl;
  returnUrl: string;
  //FormMode: string;
  showSubmit : boolean = true;
  TransactionId = -1;//-1 is for create
  ShowCommonRenderer = false; //this variable is used to show form as after common renderer form was not painting properly on refreshing.

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  FormHeader: string;
  dynamicFormGroup: FormGroup;
  formTemplate: any;
  StepId: number;  Status: string;
  CSSclass = "col-lg-6";
  Previous: string;
  //used for getting tags
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;
  // Mapping Tab items Header property
 // public headerText: Object = [{ text: ">",  }, { text: ">" }, { text: ">" }, { text: ">" }, { text: ">" }];
  public headerText: Object = [{ text: "Form" }, { text: "Tags" }, { text: "Comments" }, { text: "Attachments" }, { text: "History" }];
  public TagData: any[];
  selectionOptions: SelectionSettingsModel;

  @ViewChild('TagGrid', { static: false })
  public TagGrid: GridComponent;

  public AuditData: any[];
  @ViewChild('AuditGrid', { static: false })
  public AuditGrid: GridComponent;
  showTagAuditGrid = false;
  Source: string; SourceId: number;
  public filterSettings: FilterSettingsModel;
  public pageSetting: PageSettingsModel;
  locale: string;
  offSet: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    //private _service: FormDesignerService,
    //private _dataFieldService: DataFieldService,
    private _rendererService: FormRendererService,
    private _WFservice: RworkFlowsService,
    private _userService: UserService,
    private _masterdataService: MasterDataService
  ) {
    if (this.router.getCurrentNavigation().previousNavigation != null) {
      this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
      sessionStorage.setItem('previousUrl', this.Previous);
    }
    //Locale implementation
    this.locale = Intl.DateTimeFormat().resolvedOptions().locale;    this.offSet = new Date().getTimezoneOffset();
  }
  ngOnInit() {
   
    this.selectionOptions = { type: "Multiple" };
    //get previous url
    this.route.params.subscribe((params: Params) => {
      this.TransactionId = params['TransactionId'];
      this.StepId = +params['StepId'];
      this.FormMode = params['Mode'];
      this.Source = params['Source'];
      this.SourceId = params['SourceId'];
      this.DatafieldId = +params['DatafieldId'];
      this.DatafieldValue = +params['DatafieldValue'];
      this.FormId = +params['FormId'];
    });
    if (isNaN(this.FormId) || this.FormId == undefined || this.FormId == null)
      this.FormId = -1;
    this.filterSettings = { type: 'Excel' };
    this.pageSetting = { pageSizes: true };
    if (this.Source == 'workflow') {
      //this.WorkFlowId = this.SourceId;
      this.EntityType = 'FlexTables'
      this.underlyingTableName = 'FlexTableData';
      this.flexDataModel = new FlexTableDataModel();
       
    }
    else if (this.Source == 'MasterData') {//MasterData
      this.EntityId = +this.SourceId;
      this.EntityType = 'LReferences';
      this.underlyingTableName = 'LReferenceData';
      this.refDataModel = new ReferenceDataModel();
      //this.showTagAuditGrid = false;
    }
    this.ProjectId = +sessionStorage.getItem('ProjectId');
    if (this.FormMode == 'Review') {
      this.showSubmit = false;
    }
    this.LoggedInScopeEntityType = 'GProjects';
    this.LoggedInScopeEntityId = +sessionStorage.getItem('ProjectId');

    this.GetSourceDetails(this.Source, this.SourceId);

    
  }
  SelectedIndexes = [];
  ShowSelectedTagsOnTabSelect() {
    
    for (let i = 0; i < this.SelectedTagIds.length; i++) {
      (this.TagGrid.dataSource as object[]).forEach((sdata, index) => {
        if (sdata["Id"] === this.SelectedTagIds[i] ) {
          this.SelectedIndexes.push(index);
        }
      });
    }
    //console.log('ShowSelectedTagsOnTabSelect '+this.SelectedTagIds);
    this.TagGrid.selectRows(this.SelectedIndexes);

  }
  //GetTagsInfo() { 
  //  //when form is not Create, Get tags mapped for the transaction
  //  //this.Source == 'workflow' &&
  //  if (!(this.FormMode == 'Create') && ((this.showTagAuditGrid))) {
  //    this._userService.GetMappedTagsByTransaction(this.EntityType, this.TransactionId, this.ProjectId)
  //      .subscribe(
  //        EntityTagData => { 
  //          if (EntityTagData.length != 0) {
  //            //for (let i = 0; i < EntityTagData.length; i++) {
  //            //  this.SelectedTagIds.push(EntityTagData[i]['TagId']);
  //            //  (this.TagGrid.dataSource as object[]).forEach((sdata, index) => {
  //            //    if (sdata["Id"] === EntityTagData[i]['TagId']) {
  //            //      this.SelectedIndexes.push(index);
  //            //    }
  //            //  });
  //            //}
  //          }

  //          //this.TagGrid.selectRows(this.SelectedIndexes);
  //          //this.GetSelectedTagIds();
  //        }
  //      );
  //  }
  //  else if (this.FormMode == 'Create' && this.showTagAuditGrid) { 
  //    this.GetAvailableTags(true);
      
  //  }
  //}
  GetAvailableTags(showDefaultTags) {
    
    this._rendererService.GetAvailableTagsForUser(this.UserRoleId, this.EntityType, this.EntityId)
      .subscribe(
        data => {
          if (data.length == 0) {//raise error when tags are not available
            this.toastObj.timeOut = 2000;
            this.toasts[2].content = "There are no tags available. Please contact support to proceed.";
            this.toastObj.show(this.toasts[2]);
          }
          else {
            this.TagData = data; 
            if ((this.FormMode == 'Create') && this.showTagAuditGrid) {
              let defaultTagsforUser = data.filter(a => a.IsDefault == true);
              if (defaultTagsforUser.length != 0) {
                for (let i = 0; i < defaultTagsforUser.length; i++) {
                  this.SelectedTagIds.push(defaultTagsforUser[i]['Id']); //prepare selecte tagids for default tags assigned
                }
                //console.log('defaulttags '+this.SelectedTagIds);
              }
            }
            else if (!(this.FormMode == 'Create') && this.showTagAuditGrid) {//edit
              this._userService.GetMappedTagsByTransaction(this.EntityType, this.EntityId, this.TransactionId)
                .subscribe(
                  EntityTagData => { 
                    if (EntityTagData.length != 0) {
                      for (let i = 0; i < EntityTagData.length; i++) {
                        this.SelectedTagIds.push(EntityTagData[i]['TagId']); 
                      }
                      //console.log('GetMappedTags '+this.SelectedTagIds);
                    }
                  })
            }

            //if (showDefaultTags == true) {  //code for preselected defaulted tags. showDefaultTags = true is used  when tag grid is populated i.e. when Tags tab is selected otherwise it says TagGrid is undefined
            //  if (data.length != 0) {
            //    for (let i = 0; i < data.length; i++) { 
            //      (this.TagGrid.dataSource as object[]).forEach((sdata, index) => { 
            //        if (sdata["IsDefault"] === true) {
            //          this.SelectedIndexes.push(index);
            //        }
            //      });
            //    }
            //  }
            //  //this.TagGrid.selectRows(this.SelectedIndexes);
            //  //this.GetSelectedTagIds();
            //}

          }
        }
      );
  }
  FilePath: string;
  TargetPath: string;
  GetSourceDetails(Source, SourceId) {
    if (Source == 'workflow') {
      //get Source details 
      this._WFservice.GetWorkflowById(SourceId).subscribe(wfData => {
        this.showTagAuditGrid = wfData.TagExists == '0' ? false : true;
        this.WorkFlowDetails = wfData;
        this.FormHeader = this.FormMode + " '" + this.WorkFlowDetails.UILabel + "'";
        //get UserName for the transaction
        this._rendererService.GetUserNameforTxn(this.TransactionId, this.EntityType, this.EntityId)
          .subscribe(UserName => {
            if (UserName != null && UserName!= '')
              this.FormHeader += ' (' + UserName + ')'
        })
       
        this.EntityId = wfData.EntityId;
        this.Status = wfData.Status;
        this.ShowCommonRenderer = true;
        this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/" + this.Source + "/" + wfData['Name'];
        this.TargetPath = this.FilePath + "/attachments";
        if (this.showTagAuditGrid) {
          this.GetAvailableTags(false);
          //this.GetTagsInfo();
        }
      });
    }
    else {
      this._masterdataService.GetById(SourceId).subscribe(refdata => {
        this.FormHeader = this.FormMode + " '" + refdata['Name'] + "'";
        //get UserName for the transaction
        this._rendererService.GetUserNameforTxn(this.TransactionId, this.ProjectId, this.EntityType)
          .subscribe(UserName => {
            if (UserName != null && UserName != '')
            this.FormHeader += ' (' + UserName + ')'
        })
        //this.showTagAuditGrid = refdata['IsPortfolioEnabled'];
        this.showTagAuditGrid = refdata['TagExists'] == '0' ? false : true;
        if (this.showTagAuditGrid) {
          this.GetAvailableTags(false);
          //this.GetTagsInfo();
        }
        this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/" + this.Source + "/" + refdata['Name'];
        this.TargetPath = this.FilePath + "/attachments";
        this.EntityId = SourceId;
        this.ShowCommonRenderer = true;
        //this.GetColumnConfigurationsForEntity();
      })
    }
  }

  public dataBound(args): void { 
    if (this.SelectedIndexes.length > 0) {
      this.TagGrid.selectRows(this.SelectedIndexes);
    }
  }

  GetHistory() {
    //get History data
    this._rendererService.GetHistory(this.EntityType, this.EntityId, this.TransactionId, this.locale, this.offSet).subscribe(AuditData => {
        this.AuditData = AuditData;
      })
  }
  onTabSelect(args: any) {
    let tabName = args.selectedItem.innerText;
    if (tabName == 'HISTORY') {
      this.GetHistory();
    }
    else if (tabName == 'TAGS') {
      //
      //if (this.showTagAuditGrid) {
      //  this.ShowSelectedTagsOnTabSelect();
      //  //this.GetTagsInfo();
      //}
    }
  }
  created(e) {
    if (this.showTagAuditGrid) {
      this.ShowSelectedTagsOnTabSelect();
      //this.GetTagsInfo();
    }
  }

  SelectedTagIds: any =[];
  //GetSelectedTagIds() {
  //  let selectedTags = this.TagGrid.getSelectedRecords();//Get selected Tag Ids
  //  let idlist: number[] = [];
  //  for (let i = 0; i < selectedTags.length; i++) {
  //    idlist[i] = selectedTags[i]['Id'];
  //  }
  //  return idlist;
  //}

  rowTagSelected(e) { 
    //this.SelectedTagIds = this.GetSelectedTagIds();
    //this.TagGrid[e.rowIndex].Id
    //if (e.data['Id'] != undefined)
    //  this.SelectedTagIds.push(e.data['Id']);
    //when we choose more than one row, e.data is read as array, Otherwise, it treats it as normal variable. (e.data)
    if (e.data.length != undefined) {
      for (let i = 0; i < e.rowIndexes.length; i++) {
        this.SelectedTagIds.push(e.data[i]['Id']);
      }
    }
    else {
      this.SelectedTagIds.push(e.data['Id']);
    }
  }
  rowTagDeselected(e){
   // this.SelectedTagIds = this.GetSelectedTagIds();
    
    //let deselectId = this.TagGrid[e.rowIndex].Id;
   // let deselectId = e.data['Id']
    //if (e.data['Id'] != undefined)
    //  this.SelectedTagIds = this.SelectedTagIds.filter(item => item !== deselectId);
    if (e.data.length != undefined) {
      for (let i = 0; i < e.rowIndexes.length; i++) {
        let deselectList: string = e.data[i].Id;
        this.SelectedTagIds = this.SelectedTagIds.filter(item => item !== deselectList);
      }
    }
    else {
      let deselectId = e.data['Id']
      this.SelectedTagIds = this.SelectedTagIds.filter(item => item !== deselectId);
    }
  }
  //Error variable 
  showErrors = false; ErrorMessage = "";
  get f() { return this.dynamicFormGroup.controls; }

  FormComments:string = '';
  focusOut(target) {
    this.FormComments = target.value;
  }

  
}

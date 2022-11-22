import { Component, ViewChild, Inject } from '@angular/core';

import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GridLine, ToolbarItems, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, RowDDService, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
 
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { FormDesignerService } from '../../../services/form-designer.service';
import { DataFieldService } from '../../../services/data-fields.service'; 
import { SubProcessService } from '../../../services/subprocess.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MParentSubProcessDFViewModel } from '../../../models/step-action-sub-process-model';
import { JsonModelForSP } from '../../../models/flex-entity-model';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
@Component({
    selector: 'app-mapping-dfs',
  templateUrl: './mapping-dfs.component.html', 
  providers: [DataFieldService,FormDesignerService,ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, RowDDService]
}) 
export class MappingDFsComponent {
  hidden = false;
  //ParentProcess Dropdown
  @ViewChild('ParentProcesslistObj', { static: false })  public ParentProcesslistObj: DropDownListComponent;
  public parentDataSource: Object[];
  public parentFields: Object = { text: 'Name', value: 'StepActionId' };

  //SubProcess Dropdown
  public SubProcessDataSource: Object[];
  public SubProcessFields: Object = { text: 'Name', value: 'Id' };
  @ViewChild('SubProcesslistObj', { static: false }) public SubProcesslistObj: DropDownListComponent;
  @ViewChild('mappingGrid', { static: false }) public mappingGrid: GridComponent;

  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public filterSettings: Object;
   
  //toast
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };

  
  ShowGrid = false;
  ProjectId: number = +sessionStorage.getItem("ProjectId");
  ParentWFId: number;
  SubProcessWFId: number;
  SelectedEntityId: number; //it would be FlexTableId
  mappingGridDataSource: any;
  showCreatePopup: boolean = false;

  ParentDFDataSource: any;
  public ParentDFFields: Object = { text: 'Label', value: 'Id' };
  @ViewChild('ParentDFList', { static: false }) public ParentDFList: DropDownListComponent;

  SubProcessDFDataSource: any;
  public SubProcessDFFields: Object = { text: 'Label', value: 'Id' };
  @ViewChild('SubProcessDFList', { static: false }) public SubProcessDFList: DropDownListComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;

  CreateForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router,
    private _subprocessService: SubProcessService
  ) { 
    route.params.subscribe(val => { 
      this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
        { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' },
      ];
      this.filterSettings = { type: 'Excel' };  
      
    })
    this._subprocessService.GetParentProcesses(this.ProjectId).subscribe(data => {
      this.parentDataSource = data;
    })
  } 
   
  ChangeParentProcess(args) { 
    let StepActionId = args.value;
    this.SelectedEntityId = args.itemData['FlexTableId'];
    this.ParentWFId = args.itemData['Id'];
    this.SubProcesslistObj.text = null;
       
    this._subprocessService.GetSubProcesses(StepActionId).subscribe(data => {
      this.SubProcessDataSource = data;
    })
  }

  ChangeSubProcess(args) {
    let StepActionId = args.value;
    this.SubProcessWFId =  args.itemData['Id'];
    this.ShowGrid = true;
    this.GetGridData();
  }

  GetGridData() {
    this._subprocessService.GetMappedDFs(this.ParentWFId, this.SubProcessWFId).subscribe(data => {
      this.mappingGridDataSource = data;
    })
    
  }
  
  toolbarClick(args) {
    if (args.item.id === 'Add') {
      this.CreateForm = new FormGroup({
        ParentDF: new FormControl('', [Validators.required]),
        SubProcessDF: new FormControl(''),
        ToDirection: new FormControl(true),
        FroDirection: new FormControl(false)
      });
      this.showCreatePopup = true;

      this._subprocessService.GetAvailableDFs('FlexTables', this.ParentWFId, this.SelectedEntityId, this.ProjectId, this.SubProcessWFId).subscribe(data => {
        this.ParentDFDataSource = data;
      })
    }
    else if (args.item.id === 'Delete') {
      const selectedRecords = this.mappingGrid.getSelectedRecords(); 
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No notification selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.ConfirmDelete(selectedRecords[0]['Id']);
      } 
    }
  }

  //method called on the confirmation yes button click
  confirmDlgYesBtnClick = (): void => {
    this._subprocessService.RemoveMapping(this.selectedMappingforDelete).subscribe(data => {
      this.toasts[1].content = "Mapping deleted";
      this.toastObj.show(this.toasts[1]); 
        this.GetGridData();
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      })

       
    this.confirmDialog.hide();
    return;
  }
  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  confirmHeader: string; confirmcontent: string; selectedMappingforDelete: number;
  ConfirmDelete(Id) {
    this.confirmHeader = "Please confirm"
    this.confirmcontent = 'Are you sure you want to delete?'
    this.confirmDialog.show();
    this.selectedMappingforDelete = Id;
  }
  get f() { return this.CreateForm.controls; }

  //Paren Process Datafield  is chosen
  ChangeParentDF(args) {
    //get subprocess datafields of same datatype as Datafield chosen from Parent Process
    this._subprocessService.GetSubProcessDFs(args.value, this.SubProcessWFId).subscribe(data => {
      this.SubProcessDFDataSource = data;
    });
  }

  model: MParentSubProcessDFViewModel;
  SaveMapping() {
    this.model = new MParentSubProcessDFViewModel();
    this.model.ParentWFId = this.ParentWFId;
    this.model.SubProcessWFId = this.SubProcessWFId;
    this.model.ParentDFId = this.CreateForm.get('ParentDF').value;
    this.model.SubProcessDFId = this.CreateForm.get('SubProcessDF').value;
    this.model.ToDirection = this.CreateForm.get('ToDirection').value;
    this.model.FroDirection = this.CreateForm.get('FroDirection').value; 
    this.model.CreatedById = +sessionStorage.getItem('LoggedInUserId');
    this.model.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    this.model.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.model.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.model.CreatedDateTime = new Date();
    this.model.UpdatedDateTime = new Date();
    let jsonmodel: JsonModelForSP = new JsonModelForSP();
    jsonmodel.JSONStr = JSON.stringify(this.model);
    this._subprocessService.AddMapping(jsonmodel).subscribe(
      (data: string) => {
      let MsgPrefix: string = data.substring(0, 2);
      let Showmsg: string = data.substring(2, data.length);
      if (MsgPrefix == 'S:') {//Means success
        this.toasts[1].content = Showmsg;
        this.toastObj.show(this.toasts[1]);
      }
      else {//Error Message
        this.toasts[2].content = Showmsg;
        this.toastObj.show(this.toasts[2]);
      } 
      this.GetGridData();
      this.showCreatePopup = false;
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      });

    } 

  } 


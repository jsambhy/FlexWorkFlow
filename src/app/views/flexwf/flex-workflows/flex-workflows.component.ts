import { ViewChild, Component} from '@angular/core';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridComponent, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuItem, ContextMenuService, ToolbarItems, ReorderService, FilterSettingsModel, SelectionSettingsModel} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs, SelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { GridLine } from '@syncfusion/ej2-angular-grids';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { Router } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { FlexWorkflowsService } from '../../../services/flex-workflows.service';
import { NodeModel, PointPortModel, Connector, DiagramTools, DiagramComponent, ConnectorModel, IClickEventArgs } from '@syncfusion/ej2-angular-diagrams';
import { Ajax } from '@syncfusion/ej2-base';
import { environment } from '../../../../environments/environment';
import { WorkflowdesignerService } from '../../../services/workflowdesigner.service';
import { flexworkflowmodel } from '../../../models/flex-workflows-model';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { UserService } from '../../../services/user.service';
import { isUndefined } from 'util';
@Component({
  selector: 'app-flexworkflows',
  templateUrl: './flex-workflows.component.html',
  styleUrls: ['./flex-workflows.component.css'],
  providers: [FlexWorkflowsService, WorkflowdesignerService,ReorderService, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, FreezeService, ContextMenuService]
})
export class FlexworkflowsComponent {
  //creating viewChilds for the componenets that needs to be used
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('chk1', { static: false }) public chk1: CheckBoxComponent;
  @ViewChild('chk2', { static: false }) public chk2: CheckBoxComponent;
  @ViewChild('WFgrid', { static: false }) public WFgrid: GridComponent;
  @ViewChild('childtemplate', { static: false }) public childtemplate: any;
  //public childtemplate: any;
  public childGrid: any;

  @ViewChild('TagGrid', { static: false })
  public TagGrid: GridComponent;

  //@ViewChild('Dialog', { static: true }) public dialogObj;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  hidden: boolean = false;
  //Initializing Variables
  WFcreateForm: FormGroup = null;
  returnUrl: string; //URL for navigating to WF Designer
  returnUrlForDataFields: string; //URL for navigating to Column Configuration Screen
  public ShowPopupFlag: boolean = false;
  public confirmDialogueWidth: string = "400px";
  public confirmcontent: string;
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public showCreateWFPopup: boolean;
  public createdWFId: number; 
  workflowdata: flexworkflowmodel[];
  public contextMenuItems: ContextMenuItem[] = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending', 'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'PdfExport', 'ExcelExport', 'CsvExport', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage', 'Group', 'Ungroup'];
  public workflowmodeldata: flexworkflowmodel = new flexworkflowmodel();//declaring and initializing the variable to use further
  public editSettings: Object;  
  public position: ToastPositionModel = { X: 'Center' }; 
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public dlgButtons: any = [{ click: this.Close.bind(this),buttonModel: {content: 'Ok',isPrimary: true}}];
  dialogClose() {this.ShowPopupFlag = false;}
  public Close() { this.ShowPopupFlag = false; }
  public confirmHeader: string;
  public WFIdtoDesign: number; public FlexTableIdtoDesign: number;  public WFLabeltoDesign: string;  public WFStatus: string;
  public ShowCreateBtn: boolean;  public ShowUpdateBtn: boolean;
  public selectedWFIdForEdit: number;
  public WFCreateHeader: string;
  public confirmBoxFlag: string;
  showUploader: boolean = false;
  IsEdit: boolean = false;
  filterSettings: FilterSettingsModel;
  readonly baseUrl = environment.baseUrl;
  ProjectId: number = +sessionStorage.getItem("ProjectId");
  ProjectName: string = sessionStorage.getItem("DefaultEntityName");
  HelpFilePath: string;
  TargetPath: string;
  HelpFileName: string;
  headerText: Object = [{ text: "Workflow" }, { text: "Tag Category" }];
  LoggedInScopeEntityId: number;
  LoggedInScopeEntityType: string;
  TagData: any[];
  selectionOptionsForTag: SelectionSettingsModel;
  //----------------------------------------------------------Methods block--------------------------------------------------
  ngOnInit() {
    this.selectionOptionsForTag = { type: 'Multiple' };
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, { text: 'WorkFlow Designer', tooltipText: 'WorkFlow Designer', prefixIcon: 'e-custom-icons e-action-Icon-workflowdesigner', id: 'WFDesign' }, { text: 'Data Fields', tooltipText: 'Data Fields', prefixIcon: 'e-custom-icons e-action-Icon-datafields', id: 'FormDesign' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//it openeds the dialogue while doing ADD, EDIT, DELETE
    this.ShowCreateBtn = true;
    this.ShowUpdateBtn = false;
    this.returnUrl = '/flexwf/diagramconfiguration';
    this.returnUrlForDataFields = '/flexwf/form-labels';
    this.LoggedInScopeEntityId = +sessionStorage.getItem('LoggedInScopeEntityId');
    this.LoggedInScopeEntityType = sessionStorage.getItem('LoggedInScopeEntityType');
    this.getWFdata(); //getting all workflows to show in grid on initialization
    this.GetTagsByEntity();
  }

  GetTagsByEntity() {
   
    this._UserService.GetEntityTags(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.TagData = data;
        }
      );
  }

  //validation regarding functions
  get f() { return this.WFcreateForm.controls; }
  public isFieldValid(field: string) {
    return !this.WFcreateForm.get(field).valid && (this.WFcreateForm.get(field).dirty || this.WFcreateForm.get(field).touched);
  }


  //toolbarclick event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'grid_pdfexport') {
      this.WFgrid.pdfExport();
    }
    if (args.item.id === 'grid_excelexport') {
      this.WFgrid.excelExport();
    }
    if (args.item.id === 'grid_csvexport') {
      this.WFgrid.csvExport();
    }
    if (args.item.id === 'WFDesign') {
      const selectedRecords = this.WFgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No workflow selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.WFIdtoDesign = selectedRecords[0]['Id'];
        this.FlexTableIdtoDesign = selectedRecords[0]['EntityId'];
        this.WFLabeltoDesign = selectedRecords[0]['UILabel'];
        this.WFStatus = selectedRecords[0]['Status'];
        if (this.WFStatus == "Offline") {
          sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
          this.router.navigate([this.returnUrl, selectedRecords[0]['Id'], selectedRecords[0]['EntityId'], selectedRecords[0]['UILabel']]);
        }
        else {
          this.diagram.clear();
          this.showDiagram();
        }

        
      }
    }
    if (args.item.id === 'FormDesign') {
      const selectedRecords = this.WFgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No workflow selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.WFIdtoDesign = selectedRecords[0]['Id'];
        this.FlexTableIdtoDesign = selectedRecords[0]['EntityId'];
        this.WFLabeltoDesign = selectedRecords[0]['UILabel'];
        sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
        this.router.navigate([this.returnUrlForDataFields, 'Workflows', selectedRecords[0]['EntityId']]);

      }
    }
    if (args.item.id === 'Add') {
      this.WFCreateHeader = "Create Workflow";
      this.WFcreateForm.patchValue({
        WFName: null,
        Description: null,
        BranchSelection: false,
        Allocations: false
      });
      this.IsEdit = false;
      this.showCreateWFPopup = true;
    }
    if (args.item.id === 'Edit') {
      this.IsEdit = true;
      this.HelpFileName = null;
      sessionStorage.removeItem("UploadedFile");
      const selectedRecords = this.WFgrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No workflow selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetById(selectedRecords[0]['Id']);
      }
    }
    if (args.item.id === 'Delete') {
      const selectedRecords = this.WFgrid.getSelectedRecords();
      console.log(selectedRecords);
      
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No workflow selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.WFLabeltoDesign = selectedRecords[0]['UILabel']//UILabel
        this.DeleteWF(selectedRecords[0]['Id']);
      }
    }
  }

  public recordDoubleClick(args): void {
    this.IsEdit = true;
    this.HelpFileName = null;
    sessionStorage.removeItem("UploadedFile");
    this.GetById(args.rowData['Id']);
   
  }
   
  //getting all the workflows created by used and shoing data in grid
  public getWFdata() {
    this._service.GetWorkFlowsByScopeEntity(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.workflowdata = (data);
          //Load ChildUserGrid
          this.childGrid = {
            dataSource: this.workflowdata, 
            queryString: 'Id',
            //load() {
            //  this.registeredTemplate = {};    
            //},
            columns: [
              { field: 'Description', headerText: 'Description', width: 150, height: 200 },
              { field: 'CreatedBy', headerText: 'Created By', width: 150, height: 200 },
              { field: 'UpdatedBy', headerText: 'Updated By', width: 150, height: 200 },
              { field: 'CreatedDateTime', headerText: 'Created On', width: 150, height: 200 },
              { field: 'IsManualBranchSelection', headerText: 'Allow Branch Selection Manually', width: 150, height: 200, displayAsCheckBox:'true' },
            ],
          };
        }
      );
  }

  dataBound() { this.WFgrid.autoFitColumns(); }//automatically adjust the columns width as per the content

  SelectedTagIdList: string="";
  GetSelectedTags() {
    if (this.TagGrid != undefined) {
      var SelecedTags = this.TagGrid.getSelectedRecords();
      for (let i = 0; i < SelecedTags.length; i++) {
        this.SelectedTagIdList = this.SelectedTagIdList + SelecedTags[i]['Id'] + "^";
      }
      this.SelectedTagIdList = this.SelectedTagIdList.substring(0, (this.SelectedTagIdList.length) - 1);
    }
  }


  //method to save the workflow
  SaveWF() {
    if (this.WFcreateForm.invalid) {
      return;
    }
    else {
      this.GetSelectedTags();
      this.workflowmodeldata.UILabel = this.WFcreateForm.get('WFName').value.trim();//this.WFcreateForm.get('WFName').value;
      this.workflowmodeldata.Description = this.WFcreateForm.get('Description').value;
      this.workflowmodeldata.IsManualBranchSelection = this.chk1.checked;
      this.workflowmodeldata.IsPortfolioEnabled = false;// this.chk2.checked;
      this.workflowmodeldata.SelectedTagIdList = this.SelectedTagIdList;
      this.workflowmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.workflowmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
      this._service.Save(this.workflowmodeldata).subscribe(
        (data: flexworkflowmodel) => {
          if (data) {
            this.createdWFId = data.Id;
            this.FlexTableIdtoDesign = data.EntityId;
            this.WFLabeltoDesign = data.UILabel;
            this.WFStatus = data.Status;
            this.toastObj.timeOut = 2000;
            this.toasts[1].content = "Workflow created successfully";//as model is returned to we are adding success messge from here only
            this.toastObj.show(this.toasts[1]);
            sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
            setTimeout(() => { this.router.navigate([this.returnUrl, this.createdWFId, this.FlexTableIdtoDesign, this.WFLabeltoDesign]); }, 2000);
            this.showCreateWFPopup = false;
            this.getWFdata();
          }
          else {
            this.toasts[2].content = data;
            this.toastObj.show(this.toasts[2]);
          }
        },
        (error: any) => console.log(error)
      );
    }
  }

  //method for updating workflow
  UpdateWF() {
    if (this.WFcreateForm.invalid) {
      return;
    }
    else {
      this.GetSelectedTags();
      var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
      sessionStorage.removeItem("UploadedFile");
      if (UploadedFileInfo != null) {
        this.workflowmodeldata.HelpFilePath = this.TargetPath + "/" + UploadedFileInfo[0].FileName;//In case of Image uploading, only  one file is allowed thats why we are taking Filename from zeroth element
      }
      this.workflowmodeldata.Id = this.selectedWFIdForEdit;
      this.workflowmodeldata.UILabel = this.WFcreateForm.get('WFName').value;
      this.workflowmodeldata.Description = this.WFcreateForm.get('Description').value;
      this.workflowmodeldata.IsManualBranchSelection = this.chk1.checked;
      this.workflowmodeldata.IsPortfolioEnabled = false;// this.chk2.checked;
      this.workflowmodeldata.SelectedTagIdList = this.SelectedTagIdList;
      this.workflowmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.workflowmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
      this._service.Update(this.workflowmodeldata).subscribe(
        (data: string) => {
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg;
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          this.showCreateWFPopup = false;
          this.getWFdata();
        },
        (error: any) => console.log(error)
      );
    }
  }

  //method for deleting workflow
  DeleteWF(Id) {
    this.confirmBoxFlag = "Delete";
    this.confirmHeader = "Please confirm"
    this.confirmcontent = 'Are you sure you want to delete?'
    this.confirmDialog.show();
    this.workflowmodeldata.Id = Id;
   // this.workflowmodeldata.UILabel = 
  }

  //method to get the workflow data for edition
  FlexTableId: number;
  GetById(Id) {
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._service.GetWFById(Id)
      .subscribe(
        (data: flexworkflowmodel) => {
          //This path will use for uploading the help file
          this.TargetPath = "/" + this.ProjectId + "_" + this.ProjectName + "/workflow/" + data.UILabel + "/help";
          this.WFcreateForm.patchValue({
            WFName: data.UILabel,
            Description: data.Description,
            BranchSelection: data.IsManualBranchSelection,
            Allocations: data.IsPortfolioEnabled
          });

          this.FlexTableId = data.EntityId;
          //Need to show the Help FileName on the pop up
          this.HelpFilePath = data.HelpFilePath;
          var Array = this.HelpFilePath.split("/");
          this.HelpFileName = Array[Array.length-1];
        }
      );
    this.selectedWFIdForEdit = Id;
    this.WFCreateHeader = "Update Workflow";
    this.showCreateWFPopup = true;
  }

  selectedTagIndexes = [];
  onTabSelect(args: SelectEventArgs) {
    
    this.selectedTagIndexes =[];
    if (args.selectedIndex == 1)//Attribute tab
    {
      this.SelectedTagIdList = ''; // setting to blank string as we are creating this string while populating model altgether
      this._service.GetSelectedTagsByEntity("FlexTables",this.FlexTableId)
        .subscribe(
          (SelecedTagData) => {
            if (SelecedTagData.length != 0) {
              for (let i = 0; i < SelecedTagData.length; i++) {
                (this.TagGrid.dataSource as object[]).forEach((sdata, index) => {
                  if (sdata["Id"] === SelecedTagData[i]['TagCategoryId']) {
                    this.selectedTagIndexes.push(index);
                  }
                });
              }
            }

            //This was working in test but in dev it is late binding issue
            this.TagGrid.selectRows(this.selectedTagIndexes);
           
            
            //this.TagGrid.selectRows(this.selectedTagIndexes);
            

          }
        );
    }
  }

   //This was working in dev but in test it is not working due to early calling before setting selectedTagIndexes
  //tagGridDataBound(args) {
  //  if (!isUndefined(this.TagGrid))
  //    this.TagGrid.selectRows(this.selectedTagIndexes);
  //}

  //Delete WF confirmation box yes/no button click event
  public confirmDlgYesBtnClick = (): void => {
    if (this.confirmBoxFlag == "Delete") {
      this.workflowmodeldata.UILabel = this.WFLabeltoDesign;
      this.workflowmodeldata.ScopeEntityType = this.LoggedInScopeEntityType;
      this.workflowmodeldata.ScopeEntityId = this.LoggedInScopeEntityId;
      this._service.Delete(this.workflowmodeldata).subscribe(
        (data: string) => {
          //this.toasts[1].content = "Workflow deleted successfully";
          //this.toastObj.show(this.toasts[1]);
          let MsgPrefix: string = data.substring(0, 2);
          let Showmsg: string = data.substring(2, data.length);
          if (MsgPrefix == 'S:') {//Means success
            this.toasts[1].content = Showmsg;
            this.toastObj.show(this.toasts[1]);
          }
          else if (MsgPrefix == 'I:') {//Information message
            this.toasts[3].content = Showmsg;
            this.toastObj.show(this.toasts[3]);
          }
          else if (MsgPrefix == 'W:') {//Warning Message
            this.toasts[0].content = Showmsg;
            this.toastObj.show(this.toasts[0]);
          }
          else {//Error Message
            this.toasts[2].content = Showmsg;
            this.toastObj.show(this.toasts[2]);
          }
          
          this.getWFdata();
        });
    }
    this.confirmDialog.hide();
    return;
  }
  public confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }

  //Delete WF confirmation box definition
  public confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  constructor(private formBuilder: FormBuilder, private _service: FlexWorkflowsService,
    private router: Router,
    private _WFDesignerService: WorkflowdesignerService,
    private _SupportingDocService: SupportingDocumentService,
    private _UserService: UserService
  ) {
    //creating form fields and declaring validation that needs to be implemented
    this.WFcreateForm = this.formBuilder.group({
      WFName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      Description: new FormControl('', [Validators.maxLength(255)]),
      BranchSelection: new FormControl(''),
      Allocations: new FormControl('')
    });
  }

  //------------------------------------------------------method created by RS on 18th June 2020------------------------->
  public ShowDiagramPopUp: boolean = false;
  @ViewChild('diagram', { static: false }) public diagram: DiagramComponent; //added by RS
  public tool: DiagramTools = DiagramTools.ZoomPan;//added by RS
  //method to show the diagram on a pop up of the respective WF
  showDiagram() {
    
    this.ShowDiagramPopUp = true;
    this.diagram.fitToPage();
    this.GetNodes();
  }
  NavigateToDesigner() {
    this._WFDesignerService.UpdateWFStatus(this.WFIdtoDesign, "Offline").subscribe(
      (data: string) => {
        this.toasts[1].content = "Your Workflow is in Offline mode";
        this.toastObj.show(this.toasts[1]);
        sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
        setTimeout(() => { this.router.navigate([this.returnUrl, this.WFIdtoDesign, this.FlexTableIdtoDesign, this.WFLabeltoDesign]); }, 2000);
      }
    )
    
  }

  
 
  //connector definition
  connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.type = 'Orthogonal';
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
  }

  //node definition
  getNodeDefaults(node: NodeModel) {
    let obj: NodeModel = {};
    if (obj.width === undefined) {
      obj.width = 145;
    } else {
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
    }
    obj.style = { fill: '#357BD2', strokeColor: '#717171' };
    obj.annotations = [{ style: { color: 'white', fill: 'transparent' } }];
    obj.ports = getPorts(node);
    return obj;
  }

  //method to get nodes of the respective WF
  GetNodes() {
    const callback: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFNodes?WorkflowId=' + this.WFIdtoDesign, 'GET', false, 'application/json; charset=utf-8'
    );
    callback.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let node: NodeModel = {
              id: parsedData[i].nodeId, offsetX: parsedData[i].offsetX, offsetY: parsedData[i].offsetY,
              annotations: [{ content: parsedData[i].annotation }],
              shape: { type: parsedData[i].shapeType, shape: parsedData[i].shapeName }
            }
            //add a node in the diagram dynamically using add method.
            diagramInstance.diagram.add(node);
          }
        }
      }, 100)
    };
    callback.send().then();
    this.GetConnectors();//after nodes render then only we will get the connectors data
  }

  //method to get the connectors of the respective Workflow
  GetConnectors() {
    const getconnectors: Ajax = new Ajax(
      this.baseUrl + '/WorkflowDesigner/GetWFConnectors?WorkflowId=' + this.WFIdtoDesign + '&ProjectId=' + this.ProjectId, 'GET', false, 'application/json; charset=utf-8'
    );
    getconnectors.onSuccess = (JsonString: any): void => {
      let diagramInstance = this;
      setTimeout(function () {
        //get a diagram node from database 
        let parsedData = JSON.parse(JsonString);
        //console.log(JsonString);
        if (parsedData.length > 0) {
          //iterate a  node data 
          for (let i = 0; i < parsedData.length; i++) {
            //create a node 
            let conn: ConnectorModel = {
              id: parsedData[i].connectorId, sourceID: parsedData[i].sourceID, targetID: parsedData[i].targetID, annotations: [{ content: parsedData[i].annotation, style: { fill: "white" } }]

            }
            //console.log(node)
            //add a node in the diagram dynamically using add method. 
            diagramInstance.diagram.add(conn);

          }
        }
      }, 100)
    };
    getconnectors.send().then();
    //this.LoadDiagram();
  }

  //This function is used to just open the dialog box of uploader
  FileUpload() {
    this.showUploader = true;
  }

  
  PostUploadEvent()
  {
    
     var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      this.HelpFileName = UploadedFileInfo[0].FileName;
      }
  }

  DownloadHelpFile()
  {
    this._SupportingDocService.DownloadFromS3(this.HelpFilePath);
  }


  showParticipantPopUp: boolean = false;
  ShowParticipantPopUp() {
    this.showParticipantPopUp = true;
  }
  //--------------------------------------------------------------------------------------------------------------




}

function getPorts(obj: NodeModel): PointPortModel[] {
  let ports: PointPortModel[] = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}

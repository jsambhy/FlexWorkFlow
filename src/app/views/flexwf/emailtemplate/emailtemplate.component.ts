import { Component, ViewChild } from '@angular/core';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RichTextEditorComponent, ToolbarItems } from '@syncfusion/ej2-angular-richtexteditor';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import {
  GridComponent, EditService, ToolbarService, ColumnMenuService, ReorderService, ExcelExportService, PdfExportService, FilterSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { EmailTemplateService } from '../../../services/email-template.service';
import { LEmailTemplate } from '../../../models/EmailTemplate';
import { LinkService, ImageService, InsertHtml } from '@syncfusion/ej2-angular-richtexteditor';
import { HtmlEditorService, QuickToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { StepColumnsService } from '../../../services/step-columns.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DataFieldService } from '../../../services/data-fields.service';
import { FormDesignerService } from '../../../services/form-designer.service';
import { placeHolder } from '../../../models/placeHoldermodel';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css'],
  providers: [EmailTemplateService, ToolbarService, EditService, ExcelExportService, PdfExportService, ColumnMenuService,
    ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, DataFieldService, FormDesignerService
  ]
})
/** emailtemplate component*/
export class EmailtemplateComponent {
  WFlist: string;
  @ViewChild('customRTE', { static: false }) public rteObj: RichTextEditorComponent;
  @ViewChild('customRTESubject', { static: false }) public rteSubject: RichTextEditorComponent;
  //customRTESubject
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  @ViewChild('toasttype', { static: false }) private toastObj: ToastComponent;
  @ViewChild('confirmDialog', { static: false }) public confirmDialog: DialogComponent;
  @ViewChild('WorkflowlistObj', { static: false }) public WorkflowlistObj: DropDownListComponent;
  workflowList: Object[] = [{ text: "Workflow", value: "FlexTables" }, { text: "Master Data", value: "LReferences" }];
  WorkflowFields: Object = { text: 'text', value: 'value' };
  EntityIdList: Object[];
  EntityIdFields: Object = { text: 'DisplayTableName', value: 'Value' };
  @ViewChild('EntityIdlistObj', { static: false }) public EntityIdlistObj: DropDownListComponent;
  public countryObj: DropDownListComponent; 
  hidden: boolean = false;
  listEmailTemplate: LEmailTemplate[]; //datasource model  
  toolbar: ToolbarItems[] | object; //for showing toolbar in grid
  confirmcontent: string;
  EmailTemplateId: number;
  ShowPopupFlag: boolean;
  ShowCreateBtn: boolean = true;
  ShowUpdateBtn: boolean = false;
  editSettings: Object;
  position: ToastPositionModel = { X: 'Center' };
  EmailTempHeader: string;
  confirmHeader: string;
  EmailTemplateForm: FormGroup = null; //Related to form
  EmailTemplateModel = new LEmailTemplate();
  sessionprojectid: string = sessionStorage.getItem("ProjectId");
  projectId: number = +this.sessionprojectid; // conversion from string to int
  UserName: string = sessionStorage.getItem("LoginEmail");
  CurrentRoleName: string = sessionStorage.getItem("CurrentRoleName");
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  LoginEmail: string = sessionStorage.getItem("LoginEmail");
  SessionValues: any = sessionStorage;
  EntityType: string; EntityId: number;
  masterDataModel: placeHolder = new placeHolder();
  filterSettings: FilterSettingsModel; TemplateNameSelected: string; list: DropDownList = new DropDownList;
  dropDownListObject: DropDownList; dropDownListObjectEmailSubject: DropDownList;
  flagConfirmationBox: string;
  submitted: boolean = false;
  LoggedInScopeEntityType: string;
  LoggedInScopeEntityId: number;


  //Toast content declaration
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  //default placeholder values
  placeHolderdata: { [key: string]: Object }[] = [
    { Value: 'URL', FieldName: 'URL', EntityId: 0 },
    { Value: 'Login-Email', FieldName: 'Login-Email', EntityId: 0 },
    { Value: 'User-name', FieldName: 'User-name', EntityId: 0 },
    { Value: 'Email-OTPValidity', FieldName: 'Email-OTPValidity', EntityId: 0 },
    { Value: 'Password', FieldName: 'Password', EntityId: 0 }
  ];
  //method called on the workflow dropdown change
  onChangeWorkflow(args: any): void {    
    this.EntityType = args.value;
    this._dataFieldService.GetTableNamesByProjectIdWithType(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, "FlexTables")
      .subscribe(result => {
        this.EntityIdList = result;
      });
  }
  //method called on the dropdown of the entities
  onChangeSelecter(args: any): void {
    this.EntityId = args.value;
    this.getEntities(args.value);

    if (this.rteObj.value != null || this.rteSubject.value != null ) {
      this.flagConfirmationBox = "updateentity"
      this.confirmHeader = "Please confirm"
      this.confirmcontent = 'Changing the entity value will clear your email subject/body data. Do you wish to continue?'
      this.confirmDialog.show();
    }
  }
  //method to fill the dropdown of the rich text editor on the selection of the entity
  getEntities(value) {
    this._stepcolservice.GetAllFlattenedDFsForEntity('FlexTables', this.EntityId)   
      .subscribe(result => {
          for (var i = 0; i < result.length; i++) {
          this.placeHolderdata.push({ Value: result[i].Value, FieldName: result[i].FieldName, EntityId: value })
          }
        this.dropDownListObject.dataSource = this.placeHolderdata;//assigning the updated data into the cudtom datasource
        this.dropDownListObjectEmailSubject.dataSource = this.placeHolderdata;
        let predicate = new Predicate('EntityId', 'equal', value, true);
        predicate = predicate.or('EntityId', 'equal', 0, true);
        let query: Query = new Query();
        //frame the query based on search string with filter type.
        query = query.where(predicate);
        this.dropDownListObject.query = query;
        this.dropDownListObjectEmailSubject.query = query;
        this.dropDownListObject.text = null;
        this.dropDownListObjectEmailSubject.text = null;
        this.dropDownListObject.dataBind();
        this.dropDownListObjectEmailSubject.dataBind();
      });
  }
  //method to refresh the Rich Text Editor UI  
  opened() {
    this.rteObj.refreshUI();
    this.rteSubject.refreshUI();
  }
  //tools for the Rich Text editor
  documentEditorToolbarSettings = {
    enableFloating: true, //by this the tollbar gets separated into multiple rows
    items: [
      "Bold",
      "Italic",
      "Underline",
      {
        tooltipText: 'Select Token for Body',
        template: '<input type="text" id="dropdown" />'
      },//custom tool (dropdown) we are defining here
      "StrikeThrough",
      "|",
      "Formats",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "Undo",
      "Redo",
      "ClearFormat",
      "|",
      "CreateLink",
      "CreateTable",
      "|",
     // "Print",
      "|",
      "Outdent",
      "Indent",
      "|",
      "SuperScript",
      "SubScript",
      "|",
      "UpperCase",
      "LowerCase",
      "|",
      "FullScreen"
      
    ]
  };
  toolbarRTE = {
    items: [     
      {
        tooltipText: 'Select Token for Subject',
        template: '<input type="text" id="dropdownEmailSub" />'
      }//custom tool (dropdown) we are defining here
    ]
  };
  constructor(private _service: EmailTemplateService, private formBuilder: FormBuilder,
    private _stepcolservice: StepColumnsService, private _dataFieldService: DataFieldService) {
    this.EmailTemplateForm = this.formBuilder.group({
      TemplateName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      EmailSubject: new FormControl('', [Validators.required, Validators.maxLength(70)]),
      Signature: new FormControl('', [Validators.maxLength(4000)]),
      EmailBody: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
      Entities: new FormControl('', [Validators.required])
    });
    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
    this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
  }
  //validation regarding function
  get f() { return this.EmailTemplateForm.controls; }  
  
  ngOnInit() {    
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.    
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, 'ExcelExport', 'PdfExport', 'CsvExport', 'Search'];
    this.ShowPopupFlag = false;
    this.getData();
  }

 //method to get the data of the grid
  getData() {
    this._service.GetLEmailTemplates(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId)
      .subscribe(
        data => {
          this.listEmailTemplate = (data);
          console.log(this.listEmailTemplate);
        }
      );
  }

  //Grid tool bar clicks fired with this event
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'grid_pdfexport') {
      this.grid.pdfExport();
    }
    if (args.item.id === 'grid_excelexport') {
      this.grid.excelExport();
    }
    if (args.item.id === 'grid_csvexport') {
      this.grid.csvExport();
    }
    if (args.item.id === 'Add') {
      this.EmailTempHeader = "Create Template";
      
      //making fields blank before open
      this.EmailTemplateForm.patchValue({
        TemplateName: null,
        EmailSubject: null,
        Signature: null,
        EmailBody: null,
        Entities : null
      });
      this.WFlist = "FlexTables";//by this we are populating the Data Fields dropdown for Workflows only
      this._dataFieldService.GetTableNamesByProjectIdWithType(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, "FlexTables")
        .subscribe(result => {
          this.EntityIdList = result;//filling the entity dropdown
         
        });
      this.ShowPopupFlag = true;    
    }

    if (args.item.id === 'Edit') {
      this.confirmDialog.hide();
      this.WFlist = "FlexTables";//by this we are populating the Data Fields dropdown for Workflows only
      this.EmailTempHeader = "Update Template";
      const selectedRecords = this.grid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Template selected for this operation";
       
        this.toastObj.show(this.toasts[3]);

        //this.toastObj.content = "No Template selected for this operation";
        //this.toastObj.show();
   
      }
      else {
        this.GetEmailTemplateById(selectedRecords[0]['Id']);
      }

     
    }

    if (args.item.id === 'Delete') {
      const selectedRecords = this.grid.getSelectedRecords();
     
      if (selectedRecords.length == 0) {
        this.toasts[3].content = "No Template selected for this operation";
        this.toastObj.show(this.toasts[3]);

        // this.toastObj.content = "No Template selected for this operation";
        //this.toastObj.show();
      }
      else {
        this.TemplateNameSelected = selectedRecords[0]['TemplateName'];//TemplateName
        this.EmailTemplateId = selectedRecords[0]['Id'];
        this.DeleteEmailTemplateById();
      }
    }

  }

  //method called while saving the email template
  onFormSubmit() {
    this.submitted = true;
    if (this.EmailTemplateForm.invalid) {
      return;
    }
    else {
      this.EmailTemplateModel.TemplateName = this.EmailTemplateForm.get('TemplateName').value;
      this.EmailTemplateModel.EmailSubject = this.rteSubject.value;
      this.EmailTemplateModel.Signature = this.EmailTemplateForm.get('Signature').value;
      this.EmailTemplateModel.EmailBody =  this.rteObj.value;
      this.EmailTemplateModel.EntityId = this.EntityId;
      this.EmailTemplateModel.EntityType = "FlexTables";
      this.EmailTemplateModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.EmailTemplateModel.ScopeEntityId = this.LoggedInScopeEntityId;
      this.EmailTemplateModel.CreatedById = this.LoggedInUserId;
      this.EmailTemplateModel.CreatedByRoleId = this.LoggedInRoleId;
      this._service.PostLEmailTemplate(this.EmailTemplateModel).subscribe(
        (data: LEmailTemplate) => {
          this.toasts[1].content = "Email Template saved successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupFlag = false;
          this.getData();
        },
        (error: any) => console.log(error)
      );
    }

  }
  
  //method to get the template on the basis of Id chosen for edit
  GetEmailTemplateById(Id) {    
    this.ShowCreateBtn = false;
    this.ShowUpdateBtn = true;
    this._dataFieldService.GetTableNamesByProjectIdWithType(this.LoggedInScopeEntityType, this.LoggedInScopeEntityId, "FlexTables")
      .subscribe(result => {
        this.EntityIdList = result;

      });
    this._service.GetLEmailTemplateById(Id)
      .subscribe(
        data => {
          this.EmailTemplateForm.patchValue({
            TemplateName: data.TemplateName,
            EmailSubject: data.EmailSubject,
            Signature: data.Signature,
            EmailBody: data.EmailBody,
            Entities: data.EntityId
          });
          this.EmailTemplateModel.CreatedDateTime = data.CreatedDateTime;          
          this.EmailTemplateModel.CreatedByRoleId = data.CreatedByRoleId;
          this.EmailTemplateModel.CreatedById = data.CreatedById;
          this.EmailTemplateId = data.Id;//Id is not the part of Form thats why we need to take it in variable so that at the time of update, we can use it
        }
    );
    this.ShowPopupFlag = true;
  }


  public recordDoubleClick(args): void {
    this.WFlist = "FlexTables";//by this we are populating the Data Fields dropdown for Workflows only
    this.EmailTempHeader = "Update Template";
    this.GetEmailTemplateById(args.rowData['Id']);
  }


  //method for updating the record.
  UpdateBtnClick() {
    
    if (this.EmailTemplateForm.invalid) {
      return;
    }
    else {
      this.EmailTemplateModel.TemplateName = this.EmailTemplateForm.get('TemplateName').value;
      this.EmailTemplateModel.EmailSubject = this.rteSubject.value;
      this.EmailTemplateModel.Signature = this.EmailTemplateForm.get('Signature').value;
      this.EmailTemplateModel.EmailBody =  this.rteObj.value;
      this.EmailTemplateModel.Id = this.EmailTemplateId;
      this.EmailTemplateModel.EntityId = this.EntityId;
      this.EmailTemplateModel.EntityType = "FlexTables";
     
      this.EmailTemplateModel.UpdatedById = this.LoggedInUserId;
      this.EmailTemplateModel.UpdatedByRoleId = this.LoggedInRoleId;
      this.EmailTemplateModel.ScopeEntityType = this.LoggedInScopeEntityType;
      this.EmailTemplateModel.ScopeEntityId = this.LoggedInScopeEntityId;
      this._service.PutLEmailTemplate(this.EmailTemplateModel).subscribe(
        () => {
          this.toasts[1].content = "Email Template updated successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupFlag = false;
          this.getData();
        },
        (error: any) => console.log(error)

      );
    }
  }

  //method called for deleting the email id
  DeleteEmailTemplateById() {
    this.flagConfirmationBox = "delete"
    this.confirmHeader = "Please confirm"
    this.confirmcontent = 'Associated Notifications will also deleted. Are you sure you want to delete?'
    this.confirmDialog.show();
  }

  confirmDlgYesBtnClick = (): void => {
    if (this.flagConfirmationBox == "delete") {
      this.EmailTemplateModel.ParameterCarrier = "UserName=" + this.LoginEmail + "|WorkFlow=" + "No Workflow" + "|RoleName=" + this.CurrentRoleName + "|SessionValues=" + this.SessionValues + "|" + "ProjectId=" + this.projectId + "|" + "LoggedInUserId=" + this.LoggedInUserId + "|" + "LoggedInRoleId=" + this.LoggedInRoleId;
      this.EmailTemplateModel.Id = this.EmailTemplateId;
      this._service.DeleteEmailTemplate(this.EmailTemplateModel).subscribe(
        () => {
          this.toasts[1].content = "Email Template deleted successfully";
          this.toastObj.show(this.toasts[1]);
          this.ShowPopupFlag = false;
          this.getData();
        },
        (error: any) => console.log(error)
      );
     
    }
    else {
      this.rteObj.value = null;
      this.rteSubject.value = null;
    }
    this.confirmDialog.hide();
  }

  confirmDlgBtnNoClick = (): void => {
    this.confirmDialog.hide();
    return;
  }

  //Delete WF confirmation box definition
  confirmDlgButtons: ButtonPropsModel[] = [{ click: this.confirmDlgBtnNoClick.bind(this), buttonModel: { content: 'No' } }, { click: this.confirmDlgYesBtnClick.bind(this), buttonModel: { content: 'Yes', isPrimary: true } }];

  //defining the custom tool defination here which will create itself at its create event defined on the rich text editor component
  oncreated(): void {
    // initialize DropDownList component
    this.dropDownListObject = new DropDownList({
      placeholder: "Select Token for Body",
      width: "300px",
      fields: { text: 'FieldName' },
      //set the data to dataSource property
      dataSource: this.placeHolderdata,
      change: (args: any) => {
        this.rteObj.focusIn();
        InsertHtml.Insert(document, document.createTextNode( "{"+args.value+"}" ));//placeholder label
      }
    });
    // render initialized DropDownList
    this.dropDownListObject.appendTo('#dropdown');
    
  }
  oncreatedEmailSubject(): void {
    // initialize DropDownList component
    this.dropDownListObjectEmailSubject = new DropDownList({
      placeholder: "Select Token for Subject",
      width: "300px",
      fields: { text: 'FieldName' },
      //set the data to dataSource property
      dataSource: this.placeHolderdata,
      change: (args: any) => {
        this.rteSubject.focusIn();        
        InsertHtml.Insert(document, document.createTextNode("{" + args.value + "}"));//placeholder label
      }
    });
    // render initialized DropDownList
    this.dropDownListObjectEmailSubject.appendTo('#dropdownEmailSub');
  }
}
/////////////////////-----------------------code not in use for now, but can be used further--------------------------

    //not required for now
    //var updatedtreobjvalue = ""; var replacedString = this.rteObj.value;
    //for (let i = 0; i < this.placeHolderdata.length; i++) {
    //  if (this.rteObj.value.includes("{" + this.placeHolderdata[i].FieldName.toString() + "}")) {

    //    replacedString = replacedString.replace(this.placeHolderdata[i].FieldName.toString(), this.placeHolderdata[i].Value.toString())

    //  }
    //  updatedtreobjvalue = replacedString;
    //}   

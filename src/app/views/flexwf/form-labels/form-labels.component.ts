import { Component, ViewChild, Inject } from '@angular/core';

import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GridLine, ToolbarItems, ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, RowDDService, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Params, ActivatedRoute, Router } from '@angular/router';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { RadioButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { FormDesignerService } from '../../../services/form-designer.service';
import { DataFieldService } from '../../../services/data-fields.service';
import { ColumnConfigurationModel, MasterDataViewModel } from '../../../models/columnConfig-model';
import { CustomValidatorsService } from '../../../services/custom-validators.service';
import { RworkFlowsService } from '../../../services/rworkflows.service';
import { bool } from 'aws-sdk/clients/signer';
import { JsonModelForSP } from '../../../models/flex-entity-model';

@Component({
    selector: 'app-form-labels',
  templateUrl: './form-labels.component.html',
  styleUrls: ['./form-labels.component.css'],
  providers: [DataFieldService,FormDesignerService,ToolbarService, EditService, PageService, ExcelExportService, PdfExportService, ContextMenuService, RowDDService]
})
/** form-labels component*/
export class FormLabelsComponent {
  EntityType: string;
  EntityId: string;
  ProjectId: string;
  showListName = true;
  showPrepopulatedColumn = false;
  showUserDropdowns: bool = false;
  columnConfigurationGridData: any;
  ColumnCreateForm: FormGroup;
  ScopeEntityType: string;
  ScopeEntityId: number;
  public dateValue: Date = new Date();
  //Workflow Dropdown
  @ViewChild('entityTypeListObj', { static: false })  public entityTypeListObj: DropDownListComponent;
  public entityTypeList: Object[] = [
    { text: "Workflow", value: "FlexTables" },
    { text: "Master Data", value: "MasterData" },
    { text: "Users", value: "Users" },
    { text: "Form Grid", value: "FormGrid" }
  ];
  public EntityTypeFields: Object = { text: 'text', value: 'value' };

  //EntityList Dropdown
  public EntityIdList: Object[];
  public EntityIdFields: Object = { text: 'DisplayTableName', value: 'Value' };
  @ViewChild('EntityIdlistObj', { static: false })  public EntityIdlistObj: DropDownListComponent;

   //Project Dropdown
  @ViewChild('ProjectObj', { static: false }) public ProjectObj: DropDownListComponent;
  public ProjectDataSource: Object[];
  public ProjectFields: Object = { text: 'ProjectName', value: 'Id' };

 
  //ROle Dropdown
  public RoleTypeDataSource: Object[] = [{ text: 'Internal Users', value: 'Internal Users' },
    { text: 'External Users', value: 'External Users' }];
  public RoleTypeFields: Object = { text: 'text', value: 'value' };
  @ViewChild('RoleTypeObj', { static: false }) public RoleTypeObj: DropDownListComponent;


  @ViewChild('radiobuttonorder', { static: false }) public radiobuttonorder: RadioButtonComponent;

  //MasterData Dropdown
  public ListName: Object[];
  public ListNameFields;
  @ViewChild('ListNamelistObj', { static: false })
  public ListNamelistObj: DropDownListComponent;

  //EntityType dropdown  
  public EntityTypeSource = [
    //{ text: "Master Data", value: "LReferences" },
    { text: "Master Data", value: "MasterData" },
    { text: "Users", value: "Users" },
//    { text: "FormGrid", value: "FormGrid" },
    { text: "Workflow Transactions", value: "FlexTables" },
   // { text: "Internal Users", value: "Internal Users" }, { text: "External Users", value: "External Users" }
  ];
  public EntityTypeDataFields: Object = { text: 'text', value: 'value' };
  @ViewChild('EntityTypeDD', { static: false })
  public EntityTypeDD: DropDownListComponent;

  //DisplayColumnList Dropdown
  public DisplayColumnListSource: Object[];
  public DisplayColumnListDataFields: Object = { text: 'Label', value: 'Id' };
  @ViewChild('DisplayColumnListDD', { static: false })
  public DisplayColumnListDD: DropDownListComponent;

  //PrepopulateColumnList  Dropdown
  public PrepopulateColumnListSource: Object[];
  public PrepopulateColumnListDataFields: Object = { text: 'Label', value: 'Label' };
  @ViewChild('PrepopulateColumnListDD', { static: false })
  public PrepopulateColumnListDD: DropDownListComponent;


  showSimpleDropdown = false;
  showNewLink = false;
  showMultiselect = false;
  //grid component
  @ViewChild('ColumnsGrid', { static: false })  public ColumnsGrid: GridComponent;
  //define grid properties
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;

  //Popup Dialogue
  @ViewChild('columnCreateDialogue', { static: false })  public columnCreateDialogue: DialogComponent;
  //dialogue settings
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  public createcolumnheader: string ="Add DataField";

  public DataTypeFields: Object = { text: 'text', value: 'value' };
  //source of datatype
  public DataTypeSource: Object[];
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
  ShowPopupCreateColumn = false;
  showDropdowns = true;
  SelectedWorkflow = '';

  @ViewChild("DataTypeListObj", { static: false })
  DataTypeListObj: DropDownListComponent;
  public showdivCommonFields = false;
  public showdivCharFields = false;
  public showdivNumericFields = false;
  public showdivDateFields = false;
  public showdivTimeFields = false;
  public showCommonDefault = true;
  public showdivBooleanFields = false;
  public checkedBoolDefault = false;
  public showdivDropdownFields = false;
  @ViewChild('TimeFormatListObj', { static: false })
  public TimeFormatListObj: DropDownListComponent;
  public TimeFormat: string[] = ['AM', 'PM'];
  public TimeFormatValue: 'AM';

  public SelectedType: string = "Dropdown";
  @ViewChild('BooleanListObj', { static: false })
  public BooleanListObj: DropDownListComponent;
  public booleanSrc: string[] = ['true', 'false'];
  public booleanValue: 'true';
  showConstraintsPopup = false;
  selectedEntityId: number;
  selectedEntityType: string;
  SelectedProject;
  submitted = false;
  enableDataType: boolean = true;
  ShowAddBtn: boolean;
  ShowUpdateBtn: boolean;
  Whole: boolean = true;
  Decimal: boolean = false;
  numbertypeDisable = false;


  @ViewChild('PreviewMasterDataDropdownList', { static: false })  public PreviewMasterDataDropdownList: DropDownListComponent;

  public PreviewMasterData: Object[];
  public PreviewDataFields: Object = { text: 'AttributeC01', value: 'Id' };

  ShowMoreValuesDialogue: boolean = false;
  AddMoreValueHeader: string;
  public filterSettings: FilterSettingsModel;
  ColumnModel: ColumnConfigurationModel;
  Previous: string;
  constructor(private _service: FormDesignerService,
    private _DataFieldService: DataFieldService, private route: ActivatedRoute, private router: Router,
    private customValidatorsService: CustomValidatorsService,
    //private _labelService: DataFieldService,
    private _RworkFlowsService: RworkFlowsService) {
    
    //this._FormLabelService.GetMasterData(this.ProjectId).subscribe(MasterData => {
    //  this.MasterData = MasterData;
    //})
    route.params.subscribe(val => {
      this.lines = 'Both';
      this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
      { text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
        { text: 'Constraints', tooltipText: 'Constraints', prefixIcon: 'e-custom-icons e-action-Icon-constraints', id: 'Constraints', align: 'Left' },
        //{ text: 'Forms', tooltipText: 'Form Designer', prefixIcon: 'e-custom-icons e-action-Icon-constraints', id: 'FormDesigner', align: 'Left' },
        { text: 'Calculation', tooltipText: 'Calculation for DataField', prefixIcon: 'e-custom-icons e-action-Icon-calculations', id: 'Calc' }
      ];
      //this.editSettings = { allowEditing: true, allowAdding: true, /*allowDeleting: true,*/ mode: 'Dialog' };
      this.filterSettings = { type: 'Excel' };
      this.ProjectId = sessionStorage.getItem("ProjectId");
      this.ScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");
      this.ScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");
      //get previous url
      if (this.router.getCurrentNavigation().previousNavigation != null) {
        this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
        sessionStorage.setItem('previousUrl', this.Previous);
      }
      this.ColumnModel = new ColumnConfigurationModel();

      //read querystring params
      this.route.params.subscribe((params: Params) => {
        this.ColumnModel.EntityType = params['EntityType'];
        this.ColumnModel.EntityId = params['EntityId'];
      });

      //initialize default FormGroup elements
      this.ColumnCreateForm = new FormGroup({
        columnlabel: new FormControl('', [Validators.required, Validators.maxLength(255) ]),
        DataType: new FormControl('', [Validators.required]),
        IsMandatory: new FormControl(false),
        IsActive: new FormControl(true),
        DefaultValue: new FormControl(''),
        MinLength: new FormControl(''),
        MaxLength: new FormControl(''),
        ToolTip: new FormControl(''),
        Width: new FormControl(''),
        DigitsAfterDecimal: new FormControl(''),
        MinValue: new FormControl(''),
        MaxValue: new FormControl(''),
        MinDateInclusive: new FormControl(''),
        MaxDateInclusive: new FormControl(''),
        DefaultDateValue: new FormControl(this.dateValue),
        // TimeFormat: new FormControl(''),
        DefaultBooleanValue: new FormControl(false),
        //DropDownValues: new FormControl(''),
        ListNameValue: new FormControl(''),
        EntityTypeValue: new FormControl(''),
        DisplayColumnListValue: new FormControl(''),
        PrepopulateColumnListValue: new FormControl(''),
        IsMultiSelection: new FormControl(false),
      },
        {
          validators: [
            this.customValidatorsService.startBeforeEnd('MinDateInclusive', 'MaxDateInclusive', 'endBeforeStart'),
          ]
        }
      );

    })
  }
  EntityIdlistObjtext: string;
  
  ngAfterViewInit() { 
    //when source is workflow designer,EnityType,EntityId are available- Dont show these dropdowns for selection
    if (this.ColumnModel.EntityType != '' && this.ColumnModel.EntityType != undefined && this.ColumnModel.EntityType != null
      && this.ColumnModel.EntityType != 'null'
      && this.ColumnModel.EntityId != '' && this.ColumnModel.EntityId != undefined && this.ColumnModel.EntityId != null
      && this.ColumnModel.EntityId != 'null') {
      if (this.ColumnModel.EntityType == 'MasterData') {
        this.entityTypeListObj.value = "LReferences";
        this.ColumnModel.EntityType = "LReferences";
      }
      else if (this.ColumnModel.EntityType == 'Workflows') {
        this.entityTypeListObj.value = "FlexTables";
        this.ColumnModel.EntityType = "FlexTables";
      }
      else if (this.ColumnModel.EntityType == 'Users') {
        this.ColumnModel.EntityType = "LUsers";
        let LoggedInRoleName = sessionStorage.getItem("LoggedInRoleName").split('(')[0].trim();
        if (LoggedInRoleName == 'Project Admin') {
          this.ProjectDataSource = [];
          this.ProjectDataSource.push({ ProjectName: sessionStorage.getItem("DefaultEntityName"), Id: +sessionStorage.getItem("ProjectId") });
          this.SelectedProject = +sessionStorage.getItem("ProjectId");
        } else if (LoggedInRoleName == 'Company Admin') {

        }
        this.showUserDropdowns = true;
        
      } 
      //these properties are used for Constraints
      this.selectedEntityType = this.ColumnModel.EntityType;
      this.selectedEntityId = +this.ColumnModel.EntityId;
      this.EntityIdlistObj.value = parseInt(this.ColumnModel.EntityId);
      if (this.ColumnModel.EntityType != "LUsers") {
        //this.ColumnModel.ControlProperties = '';
        this.GetGridData(this.ColumnModel.ControlProperties);
      }
      this.showDropdowns = false;

      if (this.ColumnModel.EntityType != 'LUsers') {
        this._DataFieldService.GetEntityNameById(this.ColumnModel.EntityId, this.ColumnModel.EntityType, this.ScopeEntityType, this.ScopeEntityId)
          .subscribe(result => {
          this.SelectedWorkflow = "for '" + result['Name'] + "'";
            this.EntityIdlistObjtext = result['Name'];
            this.InitiateDataTypes(result['Type']);
        })
      }
      else {
        this.SelectedWorkflow = "for Users";
        this.InitiateDataTypes(this.ColumnModel.EntityType);
      }
      //this.InitiateDataTypes(this.ColumnModel.EntityType);
     }
  }
  onRoleChange(args) {
    let selectedRole = args.value;
    //let ControlProperties;
    if (selectedRole == 'Internal Users')
      this.ColumnModel.ControlProperties = '{IsExternal:false}';
    else
      this.ColumnModel.ControlProperties = '{IsExternal:true}';
    this.GetGridData(this.ColumnModel.ControlProperties);
  }
  private InitiateDataTypes(EntityType) {
    if (EntityType == 'FormGrid') {
      this.DataTypeSource = [
        { text: "Short Text", value: "ShortAnswer" },
        { text: "Paragraph", value: "Paragraph" },
        { text: "Date", value: "Date" },
        { text: "Number", value: "Number" },
        { text: "Yes/No", value: "Boolean" },
        { text: "SingleColumnList", value: "SingleColumnList" },
        { text: "MultiColumnList", value: "MultiColumnList" },
      ];
    }
    else {
      this.DataTypeSource = [
        { text: "Short Text", value: "ShortAnswer" },
        { text: "Paragraph", value: "Paragraph" },
        { text: "SingleColumnList", value: "SingleColumnList" },
        { text: "MultiColumnList", value: "MultiColumnList" },
        { text: "FormGrid", value: "FormGrid" },
      //{ text: "File Upload", value: "FileUpload" },
      //{ text: "Signature", value: "Signature" },
        { text: "Date", value: "Date" },
        { text: "Number", value: "Number" },
        { text: "Yes/No", value: "Boolean" },
      ];
   }
    
  }

  public goToPrevious(): void {
    this.router.navigateByUrl(sessionStorage.getItem('previousUrl'));
  }
  public onChangeEntityType(args: any): void {
    
    this.ColumnModel.EntityType = args.value;
    this.InitiateDataTypes(this.ColumnModel.EntityType);
    //populate Entity
    this._DataFieldService.GetTableNamesByProjectIdWithType(this.ScopeEntityType, this.ScopeEntityId, this.ColumnModel.EntityType)
      .subscribe(result => {
        this.EntityIdlistObj.text = null;//clear the existing selection
        this.EntityIdList = result;
    });
  }

  public onChangeSelecter(args: any): void {
    
    this.ColumnModel.EntityId = args.value;
    this.EntityIdlistObjtext = args.itemData['DisplayTableName'];
    this.selectedEntityType = this.ColumnModel.EntityType;
    this.selectedEntityId = +this.ColumnModel.EntityId;
    this.ColumnModel.ControlProperties = '';
    this.GetGridData(this.ColumnModel.ControlProperties);
  }
  get f() { return this.ColumnCreateForm.controls; }
  public GetGridData(ControlProperties) {
    this._DataFieldService.GetAllDataFieldsForEntity(this.ColumnModel.EntityType, this.ColumnModel.EntityId)
      .subscribe(result => {
        this.columnConfigurationGridData = result;
        this.ShowGrid = true;
      });

  }
  public changeHandler1(selected): void {
    this.SelectedType = selected;
  }
  //configuringEntityType: string; configuringEntityId: number;
  showCalcPopUp = false; selectedDatafieldId: number; selecetedDatafieldLabel: string; popupHeader: string; calcSource: string;
  public toolbarClick(args: ClickEventArgs): void {
    this.submitted = false;
    if (args.item.id === 'Add') {
      this.ColumnCreateForm.setValue({
        columnlabel: '', DataType: '', IsMandatory: false, IsActive: true, DefaultValue: '', MinLength: '',
        MaxLength: '', ToolTip: '',Width:'', DigitsAfterDecimal: '', MinValue: '', MaxValue: '', MinDateInclusive: '', MaxDateInclusive: '',
        DefaultDateValue: this.dateValue, 
        DefaultBooleanValue: '', //DropDownValues:''
        ListNameValue: '', EntityTypeValue: '', DisplayColumnListValue: '', PrepopulateColumnListValue:'', IsMultiSelection:false
      });
      this.numbertypeDisable = false;
      this.enableDataType = true;
      this.showdivCommonFields = false;
      this.showdivCharFields = false;
      this.showdivDateFields = false;
      this.showdivNumericFields = false;
      this.ShowPopupCreateColumn = true;
      this.ShowAddBtn = true;
      this.ShowUpdateBtn = false;
      this.showdivTimeFields = false;
      this.showdivDropdownFields = false;
      this.createcolumnheader = "Add DataField";
    }
    else if (args.item.id === 'Edit') {
      const selectedRecords = this.ColumnsGrid.getSelectedRecords();
      if (selectedRecords.length == 0) {
        this.toastObj.timeOut = 3000;
        this.toasts[3].content = "No record selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this.GetById(selectedRecords[0]['Id']);
        this.createcolumnheader = "Edit DataField";
        this.ShowAddBtn = false;
        this.ShowUpdateBtn = true;
        this.ShowPopupCreateColumn = true;
      }
    }
    else if (args.item.id === 'Constraints') {
     // sessionStorage.setItem("IsAuth", "true");
     // this.router.navigate(['/flexwf/constraints', this.ColumnModel.EntityType, this.ColumnModel.EntityId, this.ProjectId]);
      this.showConstraintsPopup = true;

    }
    else if (args.item.id === 'FormDesigner') { 
      this.router.navigate(['/flexwf/entityforms', this.ColumnModel.EntityType, this.ColumnModel.EntityId]);
    }
    if (args.item.id === 'Calc') {
      //const selectedRecords = this.ColumnsGrid.getSelectedRecords();
      //if (selectedRecords.length == 0) {
      //  //alert box need to open in which it will inform that  no row is selected for clonning
      //}
      //else
      {
        //this.selectedDatafieldId = selectedRecords[0]['Id'];
        //this.selecetedDatafieldLabel = selectedRecords[0]['Label']; 
        this.showCalcPopUp = true;
         
        this.popupHeader = "Calculation for '" + this.selectedEntityType + "'";
        this.calcSource = "Datafield";
      }
    }
  }

  public changeDataType(args: any): void {
    this.showdivCommonFields = true;
    this.showCommonDefault = true;
    this.ShowMoreValuesDialogue = false;
    if (this.DataTypeListObj.value == 'ShortAnswer') {
      this.showdivCharFields = true;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Paragraph') {
      this.showdivCharFields = true;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Number') {
      this.showdivCharFields = false;
      this.showdivNumericFields = true;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Date') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = true;
      this.showdivTimeFields = false;
      this.showdivBooleanFields = false;
      this.showCommonDefault = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Time') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = true;
      this.showCommonDefault = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = false;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'Boolean') {
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showCommonDefault = false;
      this.showdivBooleanFields = true;
      this.showdivDropdownFields = false;
    }
    else if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList'
      || this.DataTypeListObj.value == 'FormGrid') {
     // this.EntityTypeDD.text = null;
      this.showdivCharFields = false;
      this.showdivNumericFields = false;
      this.showdivDateFields = false;
      this.showdivTimeFields = false;
      this.showCommonDefault = false;
      this.showdivBooleanFields = false;
      this.showdivDropdownFields = true;
      if (this.DataTypeListObj.value == 'FormGrid') {
        this.EntityTypeSource = [{ text: "FormGrid", value: "FormGrid" }]
        this.showPrepopulatedColumn = true;
      }
      else {
        this.showPrepopulatedColumn = false;
        this.EntityTypeSource = [
          { text: "Master Data", value: "MasterData" },
          { text: "Users", value: "Users" },
          { text: "Workflow Transactions", value: "FlexTables" },
        ];
      }
      if (this.DataTypeListObj.value == 'SingleColumnList') {
        this.showSimpleDropdown = true;
        //this.showNewLink = true;
        this.showMultiselect = false;
      }
      else {
        this.showSimpleDropdown = false;
        this.showNewLink = false;
        this.showMultiselect = true;
      }
    }
    else if (this.DataTypeListObj.value == 'FileUpload' || this.DataTypeListObj.value == 'Signature') {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = "Please choose other type.";
      this.toastObj.show(this.toasts[2]);
      this.DataTypeListObj.value = '';
      return;
    }
    if (!(this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid')) {
      this.showSimpleDropdown = false;
      this.showPrepopulatedColumn = false;
      this.showNewLink = false;
      this.showMultiselect = false;
    }
  }
  PopulateModelData(SaveType) {
    debugger
    this.ColumnModel.Label = this.ColumnCreateForm.get('columnlabel').value;
    if (SaveType == 'Create') {
      //Set DataType
      if (this.DataTypeListObj.value == 'ShortAnswer' || this.DataTypeListObj.value == 'Time') {

        this.ColumnModel.DataType = "text";
      }
      else if (this.DataTypeListObj.value == 'Paragraph') {
        this.ColumnModel.DataType = "long text";
      }
      else if (this.DataTypeListObj.value == 'Number') {
        if (this.showDecimal) {
          this.ColumnModel.DataType = "numeric";
        }
        else {
          this.ColumnModel.DataType = "int";
        }
      }
      else if (this.DataTypeListObj.value == 'Date') {
        this.ColumnModel.DataType = "date";
      }
      else if (this.DataTypeListObj.value == 'Boolean') {
        this.ColumnModel.DataType = "bit";
      }
      else if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
        this.ColumnModel.DataType = "text";
      }
    }
    if (this.DataTypeListObj.value == 'SingleColumnList' || this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
      let DisplayCols = this.ColumnCreateForm.get('DisplayColumnListValue').value;
      //User must choose some display column list for List type
      if (DisplayCols == null || DisplayCols == '') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = 'Please choose some columns for display in ' + this.DataTypeListObj.value;
        this.toastObj.show(this.toasts[2]);
        return;
      }
      let dropdownListType = this.ColumnCreateForm.get('EntityTypeValue').value;
      if (dropdownListType == 'Internal Users' || dropdownListType == 'External Users') {
        this.ColumnModel.JoiningEntityType = 'LUsers';
        this.ColumnModel.JoiningEntityId = 0;
        this.ColumnModel.ControlProperties = "{SelectedType:" + this.SelectedType + "}";
      }
      else {
        //FormGrid,Users,MasterData are types of LReferences. 
        if (dropdownListType == 'FormGrid' || dropdownListType == 'Users' || dropdownListType == 'MasterData') {
          dropdownListType = 'LReferences';
        }
        this.ColumnModel.JoiningEntityType = dropdownListType;
        this.ColumnModel.JoiningEntityId = this.ColumnCreateForm.get('ListNameValue').value;
        this.ColumnModel.ControlProperties = "{SelectedType:" + this.SelectedType + "}";
      }
      if (this.PrepopulateColumnListDD != undefined)
        this.ColumnModel.DefaultValue = this.PrepopulateColumnListDD.text;
      //this.ColumnModel.DefaultValue = this.ColumnCreateForm.get('PrepopulateColumnListValue').value;
      this.ColumnModel.IsMultiSelection = this.ColumnCreateForm.get('IsMultiSelection').value;
      this.ColumnModel.ParameterCarrier = "|DisplayColumnList=" + this.ColumnCreateForm.get('DisplayColumnListValue').value;
    }
    this.ColumnModel.UserDataType = this.DataTypeListObj.value.toString();

    if (this.showDropdowns) {
      this.ColumnModel.EntityId = this.EntityIdlistObj.value.toString();
      let entityType = this.entityTypeListObj.value.toString();
      //EntityType for MasterData,Users,FormGrid is LReferences
      if (entityType == 'MasterData' || entityType == 'Users' || entityType == 'FormGrid') {
        this.ColumnModel.EntityType = 'LReferences';
      } else {
        this.ColumnModel.EntityType = this.entityTypeListObj.value.toString();
      }
    } else {
      let entityType = this.ColumnModel.EntityType;
      if (entityType == 'MasterData' || entityType == 'Users' || entityType == 'FormGrid') {
        this.ColumnModel.EntityType = 'LReferences';
      }
    }
    this.ColumnModel.IsMandatory = this.ColumnCreateForm.get('IsMandatory').value;
    this.ColumnModel.ProjectId = parseInt(this.ProjectId);
    this.ColumnModel.MinimumLength = this.ColumnCreateForm.get('MinLength').value;
    this.ColumnModel.MaximumLength = this.ColumnCreateForm.get('MaxLength').value;
    this.ColumnModel.MinValueInclusive = this.ColumnCreateForm.get('MinValue').value;
    this.ColumnModel.MaxValueInclusive = this.ColumnCreateForm.get('MaxValue').value;

    if (this.ColumnModel.UserDataType == 'Date') {
      this.ColumnModel.DefaultValue = this.ColumnCreateForm.get('DefaultDateValue').value;
      this.ColumnModel.MinDate = this.ColumnCreateForm.get('MinDateInclusive').value;
      this.ColumnModel.MaxDate = this.ColumnCreateForm.get('MaxDateInclusive').value;
    }
    else if (this.ColumnModel.UserDataType == 'Boolean') {
      this.ColumnModel.DefaultValue = this.ColumnCreateForm.get('DefaultBooleanValue').value;
    }
    else if (this.DataTypeListObj.value == 'FormGrid') {
      this.ColumnModel.DefaultValue = this.PrepopulateColumnListDD.text;
    }
    else {
      this.ColumnModel.DefaultValue = this.ColumnCreateForm.get('DefaultValue').value;
    }
    this.ColumnModel.ToolTip = this.ColumnCreateForm.get('ToolTip').value;
    this.ColumnModel.Width = this.ColumnCreateForm.get('Width').value;
    this.ColumnModel.IsActive = this.ColumnCreateForm.get('IsActive').value;
    this.ColumnModel.DigitsAfterDecimal = this.ColumnCreateForm.get('DigitsAfterDecimal').value;

  }
  UpdateFormField() {
    if (this.ColumnCreateForm.invalid) {
      return;
    }
    this.PopulateModelData('Update');
    this._DataFieldService.UpdateFormField(this.ColumnModel.Id, this.ColumnModel)
      .subscribe(result => {
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "updated successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetGridData(this.ColumnModel.ControlProperties);
        this.ShowPopupCreateColumn = false;
      },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
  }
  SaveFormField() {
    
    this.submitted = true;
    if (this.ColumnCreateForm.invalid) {
      return;
    }
    this.PopulateModelData('Create');
    this._DataFieldService.SaveFormField(this.ColumnModel, this.ScopeEntityType, this.ScopeEntityId)
      .subscribe(result => {
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Added successfully";
        this.toastObj.show(this.toasts[1]);
        this.GetGridData(this.ColumnModel.ControlProperties);
        this.ShowPopupCreateColumn = false;
      },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        });
  }
  selectedValues = [];
  fieldMapped = false; mappingText: string; showFieldForEditing = true;
  GetById(Id) {
    //check if field is mapped
    this._DataFieldService.CheckIfDatafieldIsMapped(Id).subscribe((data: string) => {
      if (data.indexOf('Not mapped') != -1) {
        this.fieldMapped = false;
        this.showFieldForEditing = true;
      }
      else {//mapped, hide field which may impact mapping. Allow only cosmetic ones
        this.fieldMapped = true;
        this.showFieldForEditing = false;
        this.mappingText = data;
      }
   
      this._DataFieldService.GetById(Id)
        .subscribe(data => {
          
          this.ColumnModel = data;
          if (data.UserDataType == 'Boolean')
            this.checkedBoolDefault = (data.DefaultValue.toLowerCase() == 'true') ? true : false;
         // let properties = JSON.parse(data.ControlProperties);
          //properties
          this.dateValue = data.DefaultValue;
          let DisplayColumn;
          if (data.UserDataType == 'SingleColumnList') {
            DisplayColumn = +data.DisplayColumnsList;
          } else {
             //DisplayColumn = data.DisplayColumnsList;
          }
        
          if (data.ControlProperties) {
            //console.log(data.ControlProperties)
          }
            this.ColumnCreateForm.patchValue({
              columnlabel: data.Label,
              DataType: data.UserDataType,
              IsMandatory: data.IsMandatory,
              IsActive: data.IsActive,
              DefaultValue: data.DefaultValue,
              DefaultDateValue: data.DefaultValue, 
              DefaultBooleanValue :data.DefaultValue,
              MinLength: data.MinimumLength,
              MaxLength: data.MaximumLength,
              ToolTip: data.ToolTip,
              Width: data.Width,
              DigitsAfterDecimal: data.DigitsAfterDecimal,
              MinValue: data.MinValueInclusive,
              MaxValue: data.MaxValueInclusive,
              MinDateInclusive: data.MinDate,
              MaxDateInclusive: data.MaxDate,
              //DropDownValues: data.DropDownValues
              ListNameValue: data.JoiningEntityId,
              EntityTypeValue: data.JoiningEntityType,
              DisplayColumnListValue: DisplayColumn,
              PrepopulateColumnListValue:data.DefaultValue,
              IsMultiSelection: data.IsMultiSelection
            });
          this.enableDataType = false;
          this.showdivCommonFields = true;
          if (data.UserDataType == 'ShortAnswer' || data.UserDataType == 'Paragraph' ) {
            this.showdivCharFields = true;
            this.showdivNumericFields = false;
            this.showdivDateFields = false;
            this.showdivTimeFields = false;
            this.showdivBooleanFields = false;
            this.showdivDropdownFields = false;
          }
          else if (data.UserDataType == 'Number') {
            this.numbertypeDisable = true;
            if (data.DataType == 'int') {//whole number
              this.showDecimal = false;
              this.Whole = true;
              this.Decimal = false;
            } else { 
              this.showDecimal = true;
              this.Whole = false;
              this.Decimal = true;
            }

            this.showdivNumericFields = true;
            this.showdivCharFields = false;
            this.showdivDateFields = false;
            this.showdivTimeFields = false;
            this.showdivBooleanFields = false;
            this.showdivDropdownFields = false;
          }
          else if (data.UserDataType == 'Date') {
            this.showdivNumericFields = false;
            this.showdivCharFields = false;
            this.showdivDateFields = true;
            this.showdivTimeFields = false;
            this.showdivBooleanFields = false;
            this.showdivDropdownFields = false;
          }
          else if (data.UserDataType == 'Time') {
            this.showdivCharFields = false;
            this.showdivNumericFields = false;
            this.showdivDateFields = false;
            this.showdivTimeFields = true;
            this.showdivBooleanFields = false;
            this.showdivDropdownFields = false;
          }
          else if (data.UserDataType == 'Boolean') {
            this.showdivCharFields = false;
            this.showdivNumericFields = false;
            this.showdivDateFields = false;
            this.showdivTimeFields = false;
            this.showdivBooleanFields = true;
            this.showdivDropdownFields = false;
          }
          else if (data.UserDataType == 'SingleColumnList' || data.UserDataType == 'MultiColumnList' || data.UserDataType == 'FormGrid') {
            this.showdivCharFields = false;
            this.showdivNumericFields = false;
            this.showdivDateFields = false;
            this.showdivTimeFields = false;
            this.showdivBooleanFields = false;
            this.showdivDropdownFields = true;
            let EntityType = data.JoiningEntityType;
            if (EntityType == 'LUsers') {
              this.showListName = false;
              this.showNewLink = false;
              this.getDisplayColumnList('LUsers', 0, this.ProjectId);
            }
            else {
              this.showListName = true;
              this.showPrepopulatedColumn = true;
              this.getListData(data.JoiningEntityType);
            }
            let args: Object = { value: data.UserDataType };
            this.LoadEntities(args);//method to populate list from
            //this.getListData(data.JoiningEntityType); 
            if (data.UserDataType == 'SingleColumnList') {
              this.showMultiselect = false;
              this.showSimpleDropdown = true
              //this.selectedValues = data.DisplayColumnsList
            }
           
            else {
              this.showMultiselect = true;
              this.showSimpleDropdown = false;
              console.log(this.DisplayColumnListSource);
              let selectedList = data.DisplayColumnsList.split(',');
              let selectionColsList = [];
              for (let j = 0; j < selectedList.length; j++) {
                selectionColsList.push(+selectedList[j]);
                //this.selectedValues.push(+selectedList[j]); 
              } 
              this.selectedValues = selectionColsList;
              console.log('selectedValues ' + this.selectedValues);
              //this.selectedValues.push( data.DisplayColumnsList)
            }
          }
          }
      );

    })
  }

  public recordDoubleClick(args): void { 
    this.GetById(args.rowData['Id']);
    this.createcolumnheader = "Edit DataField";
    this.ShowAddBtn = false;
    this.ShowUpdateBtn = true;
    this.ShowPopupCreateColumn = true;
  }

  public GoBack():void {

  }

  public LoadEntities(args: any): void {
    
    let EntityType = args.value;
    this.showListName = true;
    if (EntityType == 'FlexTables')
      this.showNewLink = false;
      //if (EntityType == 'LReferences')
    else  {
      //New List cannot be created for MulticolumnList
      if (this.DataTypeListObj.value == 'MultiColumnList' || this.DataTypeListObj.value == 'FormGrid') {
        this.showNewLink = false;
      } else {
        this.showNewLink = true;
      }
    }
    //clear selection4
    if (this.ListNamelistObj != undefined) this.ListNamelistObj.text = null;
    if (this.DisplayColumnListDD != undefined) this.DisplayColumnListDD.text = null;
      this.getListData(EntityType);
  }

  getListData(EntityType) {
    //populate Entity
    this._DataFieldService.GetTableNamesByProjectIdWithType(this.ScopeEntityType, this.ScopeEntityId, EntityType)
      .subscribe(result => {
        this.ListNameFields = { text: 'DisplayTableName', value: 'Value' };
       // this.ListName = result;
        this.ListName = [];
        (result as object[]).forEach((sdata, index) => {
          if (sdata["DisplayTableName"] === this.EntityIdlistObjtext) {
            //Exclude the value for which Datafields are being configured.
          } else {
            this.ListName.push(sdata);
          }
        });
      });
   
  }
  getDisplayColumnList(EntityType, EntityId, ProjectId) {
    this._DataFieldService.GetAllDataFieldsForEntity(EntityType, EntityId)
      .subscribe(result => {
        
        //filter only active Datafields
        this.DisplayColumnListSource = [];
        (result as object[]).forEach((sdata, index) => {
          if (sdata["IsActive"] === true) {
            this.DisplayColumnListSource.push(sdata); 
          }
        });
        this.PrepopulateColumnListSource = [];
        (result as object[]).forEach((sdata, index) => { //filter active dropdowns
          if (sdata["JoiningEntityType"] != null && sdata["JoiningEntityType"] != '' && sdata["IsActive"] === true) {
            this.PrepopulateColumnListSource.push(sdata);
          }
        });
      });
  }
  public LoadMasterDataValues(args: any): void {
    this.DisplayColumnListDD.text = null;//clear selection
    let ListType = this.ListNamelistObj.text;
    let EntityType = this.EntityTypeDD.value;
    if (EntityType != 'FlexTables') {
      EntityType = 'LReferences';
    }
    //when EntityType is [Users] Internal Users or [Users] External Users for SingleColumnList, dont show DisplayColumnDropdown
    if (!(ListType.indexOf('[Users]') !== -1))
    {
      this.getDisplayColumnList(EntityType, args.value, this.ProjectId);
    }
    else if (this.DataTypeListObj.text == 'SingleColumnList') {
      this.showSimpleDropdown = false; //dont show DisplayColumnDropdown
    }
    else {  
      this.getDisplayColumnList(EntityType, args.value, this.ProjectId);
    }
  }
  
  OpenMoreValuesDialogue(source) {
    this.ShowMoreValuesDialogue = false;
   
      let labelValue = this.ColumnCreateForm.get('columnlabel').value.replace(/ /g, "");
      if (labelValue == null || labelValue == undefined || labelValue == '') {
        this.toastObj.timeOut = 0;
        this.toasts[3].content = "Please provide Label before creating new Master Data. New Master Data will be created with same name as provided Label.";
        this.toastObj.show(this.toasts[3]);
        return;
        //setTimeout(() => { return; }, 1000);
      }
      this.AddMoreValueHeader = "Add New Master Data '" + labelValue + "'";
    this._DataFieldService.CheckMasterDataNameAlreadyExists(labelValue).subscribe(exists => {
        let alreadyExists: boolean = exists;
        if (alreadyExists) {
          this.toastObj.timeOut = 0;
          this.toasts[3].content = "Master Data '"+labelValue +"' already exists. Either change the Label to a different name OR reuse the existing Master Data by choosing it from the Master Data Name dropdown.";
          this.toastObj.show(this.toasts[3]);
          return;
          //setTimeout(() => { return; },3000);
        } else {
          this.ShowMoreValuesDialogue = true;
        }
      })
        
  }

  AddNewValues(values) {
    let ReferenceId = this.ListNamelistObj.value;
    this.ShowMoreValuesDialogue = false;
    let labelValue = this.ColumnCreateForm.get('columnlabel').value.replace(/ /g, "");
    //Add new list
    let masterDataModel: MasterDataViewModel = new MasterDataViewModel();
    masterDataModel.CreatedById = +sessionStorage.getItem('LoggedInUserId');
    masterDataModel.UpdatedById = +sessionStorage.getItem('LoggedInUserId');
    masterDataModel.CreatedDateTime = new Date();
    masterDataModel.UpdatedDateTime = new Date();
    masterDataModel.CreatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    masterDataModel.UpdatedByRoleId = +sessionStorage.getItem('LoggedInRoleId');
    masterDataModel.Values = values;
    masterDataModel.Label = labelValue;
    masterDataModel.ScopeEntityType = this.ScopeEntityType;
    masterDataModel.ScopeEntityId = this.ScopeEntityId;
    masterDataModel.ParameterCarrier = "UserName=" + sessionStorage.getItem("LoginEmail") + "|WorkFlow=DataFields|LoggedInUserId=" + sessionStorage.getItem('LoggedInUserId')
      + "|LoggedInRoleId=" + sessionStorage.getItem('LoggedInRoleId')
    //console.log(JSON.stringify(masterDataModel));
    let jsonmodel: JsonModelForSP = new JsonModelForSP();
    jsonmodel.JSONStr = JSON.stringify(masterDataModel);
    this._DataFieldService.AddNewReferenceData(jsonmodel).subscribe(newRefId => {
      this.ShowMoreValuesDialogue = false;
      //dropdown updated
      this._DataFieldService.GetMasterDataForDropdown(this.ScopeEntityType, this.ScopeEntityId).subscribe(listdata => {
        this.toastObj.timeOut = 2000;
        this.toasts[1].content = "List added successfully.";
        this.toastObj.show(this.toasts[1]);
        this.ListName = listdata;
        this.ListNamelistObj.value = newRefId;
        this.ListNamelistObj.text = labelValue;
      })
    },
      (error: any) => {
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }
    );
  }

  showDecimal: boolean = false;
  SetNumberFieldType(value) {
    if (value == 'Decimal') {
      this.showDecimal = true;
      this.Whole = false;
      this.Decimal = true;
    } else {
      this.showDecimal = false;
      this.Whole = true;
      this.Decimal = false;
    }
  }
  sourceId: number;

  
  rowDrop(args) {
    let SoucreId = args.data[0]['Id']
    let fromIndex = args['fromIndex']; let dropIndex = args['dropIndex'];
    let sourcedata =this.columnConfigurationGridData[fromIndex];
    let targetdata = this.columnConfigurationGridData[dropIndex];
    let TargetId = targetdata['Id']; 
    this._DataFieldService.DragAndDropRowDynamic(SoucreId, TargetId).subscribe(data => {
      this.GetGridData(this.ColumnModel.ControlProperties);
    })
  }
  SelectedRowIdforAddInBetween: number;
  rowSelected(args) {
    this.SelectedRowIdforAddInBetween = args.data['Id'];
    this.ColumnModel.ParameterCarrier = "SourceRowIdForAdd=" + this.SelectedRowIdforAddInBetween;
  }

  omit_special_char(event) {
    //These symbols are used for manipulating data during Excel data upload.
    var k = event.charCode;  //         k = event.keyCode;  (Both can be used)
   // var e = e || window.event;
   // var k = e.which || e.keyCode;
   // var s = String.fromCharCode(k);
   // console.log(s);
    return !(k == 40 || k == 41 || k == 42 || k == 43 || k == 126);// (,),*,~,+
  }
}


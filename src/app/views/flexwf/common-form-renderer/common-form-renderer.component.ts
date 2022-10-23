import { Component, Input, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { DataFieldService } from '../../../services/data-fields.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { FormDesignerService } from '../../../services/form-designer.service';
import { SelectionSettingsModel, ToolbarItems, EditService, ToolbarService, PageService, NewRowPosition, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { FlexTableDataModel, ReferenceDataModel, JsonModelForSP } from '../../../models/flex-entity-model';
import { FormRendererService } from '../../../services/form-renderer.service';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";  
import { Ajax } from '@syncfusion/ej2-base';
import { GenericGridService } from '../../../services/generic-grid.service';
import { environment } from '../../../../environments/environment';
import { isUndefined } from 'util';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { CalculationsService } from '../../../services/calculations.service';
import { bool } from 'aws-sdk/clients/signer';
import { Title } from '@angular/platform-browser';
 
@Component({
  selector: 'app-common-form-renderer',
  templateUrl: './common-form-renderer.component.html',
  styleUrls: ['./common-form-renderer.component.css'],
  providers: [DataFieldService, EditService, NgxSpinnerService, CalculationsService]
})
/** CommonFormRenderer component*/
export class CommonFormRendererComponent implements AfterViewInit {
  @Input() EntityType: string;
  @Input() EntityId: number;
  @Input() FormMode: string;
  @Input() Source: string;
  @Input() SourceId: number;
  @Input() ProjectId: number;
  @Input() TransactionId: number;
  @Input() StepId: number;
  @Input() Status: string;
  @Input() DatafieldId: number;
  @Input() DatafieldValue: number;
  @Input() FormComments: string;
  @Input() SelectedTagIds: number[];
  @Input() TaggingEnabled: boolean;
  @Input() FormId: number;
  @Input() UserId: number;
  WorkflowId: number;
  FormHeader: string;
  dynamicFormGroup: FormGroup;
  DataFieldsArray: any=[];
  CSSclass = "col-lg-6";
  CSSclassMain = "col-lg-12"
  showErrors = false;
  ErrorMessage = "";
  flexDataModel: FlexTableDataModel;
  refDataModel: ReferenceDataModel;
  public toolbar: ToolbarItems[] | object;
  public editSettings: Object;
  public filterSettings: FilterSettingsModel;


  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  showSave = false; showSaveClose = true; LoggedInRoleId: number; LoggedInUserId: number;
  constructor(private formBuilder: FormBuilder,
    @Inject(GenericGridService) private _genericGridService: GenericGridService,
    private _dataFieldService: DataFieldService,
    private _service: FormDesignerService,
    private _rendererService: FormRendererService,
    private router: Router,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private _calcService: CalculationsService,
    private _formDesignerService: FormDesignerService,
    private titleService: Title,
  ) {
    this.LoggedInRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.LoggedInUserId = +sessionStorage.getItem('LoggedInUserId');
    this.WorkflowId = +sessionStorage.getItem("WorkflowId");
    //this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add', align: 'Left' },
    //{ text: 'Edit', tooltipText: 'Edit', prefixIcon: 'e-custom-icons e-action-Icon-editpencil', id: 'Edit', align: 'Left' },
    //{ text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete', align: 'Left' },
    //];
    //this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog'  };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };
    this.filterSettings = { type: 'Excel' };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
  }

  ngAfterViewInit() {//we used ngAfterViewInit instead of ngOnInit because we have multiple database call before rendering the page at the front end otherwise data can be blank.
    
    if (this.Source == 'workflow') {
      this.flexDataModel = new FlexTableDataModel();
    }
    else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {//MasterData
      this.refDataModel = new ReferenceDataModel();
    }
    //console.log("common EntityId is :" + this.EntityId);
    this.GetColumnConfigurationsForEntity();
    this.GetFormActions();
  }
  SectionIdsArr = []; SectionDataFieldsArr = [];
  TabIdsArr = []; TabSectionDataFieldsArr = [];
  group = {}; index = 0; ShowAsTabs = false;

  //All field will be created dynamically in Generate Form.
  GenerateForm(data, IsDefaultTabLoad) {
    
    if (data == undefined) {
      data = [];
    } 
  
    
    //generating FormGroup dynamically
   
    let l_tabDataArr = [];

    //Iterating all configured DataFields(Columns)
    for (this.index; this.index < this.DataFieldsArray.length;) {
      let l_DataField = this.DataFieldsArray[this.index];
      l_tabDataArr.push(l_DataField);
      let controlName = l_DataField.ColumnName;
      this.DataFieldsArray[this.index]["styling"] = JSON.parse(l_DataField.Styling);
      this.DataFieldsArray[this.index]["CSSclassMain"] = l_DataField.CssClass;

      //apply validations on control 
      var validators = [];
      if (l_DataField.IsMandatory) {
        validators.push(Validators.required);
      }
      if (l_DataField.MinimumLength) {
        validators.push(Validators.minLength(l_DataField.MinimumLength));
      }
      if (l_DataField.MaximumLength) {
        validators.push(Validators.maxLength(l_DataField.MaximumLength));
      }
      if (l_DataField.MinValueInclusive) {
        validators.push(Validators.min(l_DataField.MinValueInclusive));
      }
      if (l_DataField.MaxValueInclusive) {
        validators.push(Validators.max(l_DataField.MaxValueInclusive));
      }
      if (l_DataField.MinDate) {
        validators.push(Validators.min(l_DataField.MinDate));
      }
      if (l_DataField.MaxDate) {
        validators.push(Validators.max(l_DataField.MaxDate));
      }
      if (l_DataField.UserDataType == 'FormGrid') {
        if (l_DataField.RestrictionType == 'Readonly')
          l_DataField['ShowEditIcons'] = false;//supprasses the + sign in Form Grid
        else
          l_DataField['ShowEditIcons'] = true;
        //processing dynamic formgroup
        controlName = l_DataField.Label;
        let gridColumns = JSON.parse(l_DataField.DropdownColumns);
        //manipulating JSON for fields and datasource as this is to be read in HTMLin JSON only. So modifying JSON aftr parsing
        for (var i = 0; i < gridColumns.length; i++) {
          if (gridColumns[i].fields != undefined && gridColumns[i].fields != null) {
            gridColumns[i].fields = JSON.parse(gridColumns[i].fields);
          }
          if (gridColumns[i].dataSource != undefined && gridColumns[i].dataSource != null) {
            gridColumns[i].dataSource = JSON.parse(gridColumns[i].dataSource);
          }
        }
        this.DataFieldsArray[this.index]['GridControls'] = gridColumns;
        this.group['' + controlName] = this.formBuilder.array([]);//create control array for formgrid type
      }

      //if control is dropdown type or grid type, prepare its Columns and DataSource 
      let ddselectedValuesInfo;
      if (l_DataField.UserDataType == 'SingleColumnList' || l_DataField.UserDataType == 'MultiColumnList') {
        //SCL and MCL prefix are used for SingleColumnList and MultiColumnList controls with thier Datafield Id value
        //because We cannot start any control Id or name with a digit. It results in some exceptions
        if (l_DataField.UserDataType == 'SingleColumnList')
          controlName = 'SCL' + l_DataField.Id;
        else if (l_DataField.UserDataType == 'MultiColumnList')
          controlName = 'MCL' + l_DataField.Id;

        let dropdownData = JSON.parse(l_DataField.DropdownData);
       // dropdownData = dropdownData.push({'AttributeC01': '', 'Id': -1,'IsSelected':0})
        this.DataFieldsArray[this.index]["dataSource"] = dropdownData;//setting datasource

        //manipulate selected dropdown information, IsSelected value would be 0 for Create case. This loop wont execute in Create case
        let selectedData = [];
        if (dropdownData != null) {
          selectedData = dropdownData.filter(x => x.IsSelected == 1);
        }
        let selectedDDValueList: number[] = new Array();
        for (let j = 0; j < selectedData.length; j++) {
          selectedDDValueList.push(selectedData[j]['Id']);
        }

        if (this.DatafieldId != undefined && this.DatafieldId != null && this.DatafieldId == l_DataField.Id) {
          selectedDDValueList.push(this.DatafieldValue);

           //This function will show the selected values/rows in the dropdown Type DataFields.
          this.dropdownCommon(this.DatafieldId, this.DatafieldValue, false);
        }

        //Preparing text(show in front end) and value(for internal processing) field for dropdowns
        let columnsinfo = JSON.parse(l_DataField.DropdownColumns);
        if (l_DataField.UserDataType == 'SingleColumnList') {
          this.DataFieldsArray[this.index]["fields"] = { text: columnsinfo[0]['ColumnName'], value: 'Id' };

          if (l_DataField.IsMultiSelection == true) {
            //in case of multi selection DD, all values are displayed that are being returned from API
            ddselectedValuesInfo = selectedDDValueList;
          }
          else {
            //in case of single selection DD, only one value is displayed so taking 0th element as array is being returned from API
            ddselectedValuesInfo = selectedDDValueList[0];
          }
        }

        else if (l_DataField.UserDataType == 'MultiColumnList') {//Multi column dropdown displayed as grid
          this.DataFieldsArray[this.index]["gridColumns"] = columnsinfo;
          if (l_DataField.IsMultiSelection == false) {//allow single selection
            this.DataFieldsArray[this.index]["selectionOptions"] = { type: "Single" };
            //Calculate Grid's selected row index because Grid selection works on Indexes not on row Id value
            (this.DataFieldsArray[this.index]["dataSource"]).forEach((sdata, idx_selected) => {
              if (sdata["Id"] === selectedDDValueList[0]) {
                this.DataFieldsArray[this.index]['selectedIndex'] = idx_selected;
              }
            });
          }
          else {//when MultiSelection is allowed
            //it will allow multi row selection in the Grid
            this.DataFieldsArray[this.index]["selectionOptions"] = { type: "Multiple", enableSimpleMultiRowSelection: true };
            ddselectedValuesInfo = selectedDDValueList;
          }
        }
      }
      let disabled = false;
      if (this.FormMode == 'Review') {
        //In case of Review, we need to render all controls in readonly mode  
        disabled = true;
        this.showSave = false;// dont show Save button
        this.showSaveClose = false;// dont show "Save and Close" button
        l_DataField['ShowEditIcons'] = false; // dont show formGrid edit icons
      }
      if (this.FormMode == 'Edit') {
        //this.showSaveClose = true;
        this.showSave = true;
      }
      if (l_DataField.RestrictionType == 'Readonly') {
        disabled = true;
      }
      //for displaying calculation icon
      if (l_DataField.IsCalculated == 'true' || l_DataField.IsCalculated == true || l_DataField.IsCalculated == 1) {
        //If calculation is true on Datafield then we show Calculation icon.
        l_DataField['ShowCalcIcon'] = true; 
      }

      let fieldvalue = ''
      if (l_DataField.UserDataType != 'FormGrid')
      { //donot create any control when its formGrid type
        if (this.FormMode == 'Create')
        {
          if (l_DataField.DefaultValue != null && l_DataField.DefaultValue != undefined) {//populate with default if any
            //setting default value at the time of creation
            fieldvalue = l_DataField.DefaultValue;
          }
          this.group[controlName] = new FormControl({ value: fieldvalue, disabled: disabled }, validators);
        } else {
          if (data[l_DataField.ColumnName] != null && data[l_DataField.ColumnName] != undefined) {
            fieldvalue = data[l_DataField.ColumnName]
          }
          this.group[controlName] = new FormControl({ value: fieldvalue, disabled: disabled }, validators);
        }

        if (l_DataField.UserDataType == 'SingleColumnList' || l_DataField.UserDataType == 'MultiColumnList') {
          this.group[controlName]['value'] = ddselectedValuesInfo;
        }
      }
      
      if (l_DataField.Calculation != undefined) { // this column is part of calculation
        this.group[controlName].valueChanges.subscribe(x => {
          let TargetColumnNameList: string = l_DataField.CalcTargetDFName;
          let IsTargetFormLevelField = l_DataField.IsTargetFormLevelField;
          //let TargetColumnType = l_DataField.CalcTargetDFType;
          let calculation = l_DataField.Calculation;
         // let SourceColumnLabel = l_DataField.Label;
          let rawGrpValues = this.dynamicFormGroup.getRawValue();//get value of complete formgroup array values 
          let impactedJson = JSON.stringify(rawGrpValues);

          this.GetCalculations(calculation, impactedJson, TargetColumnNameList, this.group, IsTargetFormLevelField)

          //this._service.GetCalculatedValue(calculation, impactedJson, this.ProjectId).subscribe(calcValue => {
          //  //when we have multiple dependent columns then thereare multiple calculations(which result in multiple resultant value)
          //  let TargetColumnNameArray = TargetColumnNameList.split('~');
          //  if (calcValue != null) {
          //    calcValue = calcValue[0]['Result'];
          //    if (calcValue != null) { // calcValue[0]['Result'] can be null
          //      let calcValueArray = calcValue.split('~');
          //      for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
          //        let TargetColumnName = TargetColumnNameArray[calIdx];
          //        group['' + TargetColumnName].setValue(calcValueArray[calIdx]);//setting target column value to corrsponding resultant value
          //      }
          //    }
          //  } else {
          //    for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
          //      let TargetColumnName = TargetColumnNameArray[calIdx];
          //      group['' + TargetColumnName].setValue('');//setting target column value to '' when received null
          //    }
          //  }
          //})
        })
      }
      this.index++;
    }

    this.dynamicFormGroup = this.formBuilder.group(this.group);  
    //add controls for the formgroup for FormGrid type 
    //let filtereddata = this.DataFieldsArray.filter(x => x.UserDataType == 'FormGrid');
    
    let filtereddata = l_tabDataArr.filter(x => x.UserDataType == 'FormGrid');
    filtereddata.forEach(fgdata => { 
      //if (this.FormMode != 'Create') {
      if (fgdata.DropdownData != null && fgdata.DropdownData != '') {
        let fgtxnData = JSON.parse(fgdata.DropdownData);
        
        if (fgtxnData != null) { 
          let formGroupCntrlCount = fgtxnData.length;//these many times group needs to be created
          let counter = 0;
          while (counter < formGroupCntrlCount) {
            if (fgtxnData[counter]['DataId'] != -9999) {// -9999 referes to null value in Dropdown which we do not want to insert , so ignoring   
              this.AddControls(fgdata.Label, fgtxnData[counter], fgdata.Id);
            }
            counter++;
          }
        }
      }
      //else {
      //  this.AddFirstControls(fgdata.GridControls, fgdata.Label);
      //}
    })  
    
    //retrieve distinct SectionIds
    this.SectionIdsArr = this.DataFieldsArray.filter(
      (thing, i, arr) => arr.findIndex(t => t.SectionId === thing.SectionId) === i
    );
    //console.log(this.DataFieldsArray);
    //section variable prepration
    this.SectionIdsArr.forEach(section => {
      let SectionId = section.SectionId;
      this.SectionDataFieldsArr.push({
        'SectionId': SectionId, 'DataFields': this.DataFieldsArray.filter(a => a.SectionId == SectionId) });
    });
    //console.log( this.SectionDataFieldsArr);

     
    for (let i = 0; i < this.TabIdsArr.length; i++)
    {
      let TabId = this.TabIdsArr[i]['Id'];
      let SectionArr = []
      for (let j = 0; j < this.SectionIdsArr.length; j++) {
        let SectionId = this.SectionIdsArr[j].SectionId;
        let SectionBGColor = this.DataFieldsArray.filter(a => a.SectionId == SectionId)[0]['SectionBGColor']; 
        if (this.TabIdsArr[i]['Id'] == this.SectionIdsArr[j].TabId) { 
          SectionArr.push({
            'SectionId': SectionId, 'DataFields': this.DataFieldsArray.filter(a => a.SectionId == SectionId),
            'SectionCSS': { "background-color":  + SectionBGColor  }
          });
        }
      } 
      //if index is -1, item not found. item  already exists, dont push it 
      let ItemIndex = this.TabSectionDataFieldsArr.findIndex(item => item.TabId === TabId);
      if (ItemIndex != -1) { //Tab is clicked and data is loaded, update it.
        if (SectionArr.length > 0)
        this.TabSectionDataFieldsArr[ItemIndex]['Sections'] = SectionArr;
      }
      else {
        this.TabSectionDataFieldsArr.push({ 'TabId': TabId, 'TabName': this.TabIdsArr[i]['Label'], 'Sections': SectionArr,'TabCSS':'color:green' });
        //this.TabSectionDataFieldsArr.push({ 'TabId': SelectedTabId, 'TabName': SelectedTabName, 'Sections': SectionArr });
      }
    }
    /*
      TabSectionDataFieldsArr = [{TabId: 121, Sections : [
	       {SectionId:1,DataFields: [{Id:11,Label:'F1'},{Id:12,Label:'F2'},{Id:13,Label:'F3'}] } ,
	       {SectionId:2,DataFields: [{Id:21,Label:'F1'},{Id:22,Label:'F2'} ] }
       ]},
      {TabId: 131, Sections :
	       {SectionId:3,DataFields: [{Id:11,Label:'F1'},{Id:13,Label:'F3'}] }
       ]}
      ]

      */
    //Save should be enabled when user has clicked tab atleast once
    
    if (this.TabClickArr.filter(a => a.clicked == 'yes').length == this.TabSectionDataFieldsArr.length) {
      this.savedisabled = false;
    } else {
      this.savedisabled = true;
    }
  }

  TabClickArr = []; savedisabled = true;
  onTabSelect(args) {
    let selectedIndex = args.selectedIndex;
    let SelectedTabId = this.TabIdsArr[selectedIndex]['Id'];
    let SelectedTabName = this.TabIdsArr[selectedIndex]['Label']
    //if tab is clicked again, donot get data  from backend again
    let ItemIndex = this.TabClickArr.findIndex(item => item.TabId === SelectedTabId);
    if (ItemIndex == -1) { 
      this.TabClickArr.push({ 'TabId': SelectedTabId, 'clicked': 'yes' });
      this.GetTabData(SelectedTabId, false);
    }
    //if (this.TabClickArr.filter(a => a.clicked == 'yes').length == this.TabSectionDataFieldsArr.length) {
    //  this.savedisabled = false;
    //} else {
    //  this.savedisabled = true;
    //}
  }


  GetCalculations(calculation, impactedJson, TargetColumnNameList, group, IsTargetFormLevelField) { 
    //*************************************
    this._service.GetCalculatedValue(calculation, impactedJson).subscribe(calcValue => {
      //when we have multiple dependent columns then thereare multiple calculations(which result in multiple resultant value)
      let TargetColumnNameArray = TargetColumnNameList.split('~');
      let IsTargetFormLevelFieldarr = IsTargetFormLevelField.split('~');
      if (calcValue != null) {
        calcValue = calcValue[0]['Result'];
        if (calcValue != null) { // calcValue[0]['Result'] can be null
          let calcValueArray = calcValue.split('~');
          for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
            let TargetColumnName = TargetColumnNameArray[calIdx];
            if (IsTargetFormLevelFieldarr[calIdx] == 1) {
              this.f['' + TargetColumnName].setValue(calcValueArray[calIdx]);
            } else {
              group['' + TargetColumnName].setValue(calcValueArray[calIdx]);//setting target column value to corrsponding resultant value
            }
          }
        }
      }
      else {
        for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
          let TargetColumnName = TargetColumnNameArray[calIdx];
          if (IsTargetFormLevelFieldarr[calIdx]) {
            this.f['' + TargetColumnName].setValue('');
          } else {
            group['' + TargetColumnName].setValue('');//setting target column value to corrsponding resultant value
          }
        }
      }
    })
     
  }
  RemoveControls(i, ControlLabel) {

    //if (this.dynamicFormGroup.get('' + ControlLabel)['length'] > 0) {
      let indexToBeUpdated = this.arrGrpIndex.findIndex(a => a.Label == ControlLabel);
    this.arrGrpIndex[indexToBeUpdated]['value'] = this.dynamicFormGroup.get('' + ControlLabel)['length'] - 1;
    //}
    //else {
    //  this.arrGrpIndex.push({ 'Label': ControlLabel, 'value': 0 });
    //} 

    //remove item
    (<FormArray>this.dynamicFormGroup.get('' + ControlLabel)).removeAt(i);
    
    //Update groupIndex value of each element in array as we have removed one element
    for (let j = i; j < this.dynamicFormGroup.get('' + ControlLabel)['controls'].length; j++) {
      let existingVal = this.dynamicFormGroup.get('' + ControlLabel)['controls'][j].controls['groupIndex'].value['value'];
      this.dynamicFormGroup.get('' + ControlLabel)['controls'][j].controls['groupIndex'].value['value'] = existingVal - 1;
    } 

    let formGridData = this.DataFieldsArray.filter(x => x.Label == ControlLabel);
    let grp = {}; //let grpIdx = 0;
    formGridData.forEach(control => {
      let columnsList = control.GridControls;//get the list of controls/columns that are configured
      columnsList = columnsList.filter(x => x.Calculation != undefined);
      
      columnsList.forEach(column => {

        //get the name/Label of the Column which will be used in binding
        let ctrlname = column.ColumnName;
        if (ctrlname == null) {
          ctrlname = column.Label;           
        }
        if (column.Calculation != undefined) { // this column is part of calculation
          //grp[ctrlname].valueChanges.subscribe(x => {
          let TargetColumnNameList: string = column.CalcTargetDFName;
          let IsTargetFormLevelField = column.IsTargetFormLevelField;
            let calculation: string = column.Calculation;
            let rawGrpValues = (<FormArray>this.dynamicFormGroup.get('' + ControlLabel)).getRawValue();//get value of complete formgroup array values
            let impactedJson: string;
            //let FormLevelField: boolean = false;
            //When calculation formula contains any aggregate fn, send complete formGrid JSON. Otherwise, send only current row JSON. 
            if (calculation.indexOf('MIN') != -1 || calculation.indexOf('MAX') != -1 || calculation.indexOf('SUM') != -1
              || calculation.indexOf('COUNT') != -1 || calculation.indexOf('AVG') != -1) { //aggregate calculation
              impactedJson = JSON.stringify(rawGrpValues);
              //FormLevelField = true;
            }
            else { //normal calculation
              impactedJson = JSON.stringify(rawGrpValues[i]);
          }
          this.GetCalculations(calculation, impactedJson, TargetColumnNameList, null, IsTargetFormLevelField);
            //this._service.GetCalculatedValue(calculation, impactedJson, this.ProjectId).subscribe(calcValue => {
            //  //when we have multiple dependent columns then thereare multiple calculations(which result in multiple resultant value)
            //  let TargetColumnNameArray = TargetColumnNameList.split('~');
            //  if (calcValue != null) {
            //    calcValue = calcValue[0]['Result'];
            //    if (calcValue != null) { // calcValue[0]['Result'] can be null
            //      let calcValueArray = calcValue.split('~');
            //      for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
            //        let TargetColumnName = TargetColumnNameArray[calIdx];
            //        if (FormLevelField) {
            //          this.f['' + TargetColumnName].setValue(calcValueArray[calIdx]);
            //        }
            //      }
            //    }
            //  }
            //  else {
            //    for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
            //      let TargetColumnName = TargetColumnNameArray[calIdx];
            //      if (FormLevelField) {
            //        this.f['' + TargetColumnName].setValue('');
            //      }  
            //    }
            //  }

            //})
         // })
        } 
      })
    })


    
  }
  
  grpIdx = 0;
  arrGrpIndex = [];
  // when add button pressed eah time Controls are added
  AddControls(ControlLabel, data,ControlId) {
    let idx = this.DataFieldsArray.findIndex(a => a.Id == ControlId);
    let showHideValue = this.DataFieldsArray[idx]['showHide'];
    if (!showHideValue && data == null) { //when + button is clicked, expand the grid if not already expanded
      this.DataFieldsArray[idx]['showHide'] = true;
    }
    //get data for the underlying control i.e. FormGrid whose rows to be replicated
    let formGridData = this.DataFieldsArray.filter(x => x.Label == ControlLabel);
    let grp = {}; //let grpIdx = 0;
    formGridData.forEach(control => {
      let columnsList = control.GridControls;//get the list of controls/columns that are configured 
      columnsList.forEach(column => { 
        if (column.ColumnType == "MultiColumnList") { 
          column['ColumnsFieldInfoArray'] = JSON.parse(column['ColumnsFieldInfo']);
          //column['ColumnsFieldInfo'] = [{ 'ColName': 'AttributeC01', 'Label': 'KPI' },
          //  { 'ColName': 'AttributeI01', 'Label': 'Weightage' }          ]
        }
        //get the name/Label of the Column which will be used in binding
        let ctrlname = column.ColumnName;
        let selectedDataId = null;
        //apply validations on control
        var validators = [];
        if (column['IsMandatory'] != undefined && column['IsMandatory'] ) {
          validators.push(Validators.required);
        }
        if (column['MinimumLength'] != undefined ) {
          validators.push(Validators.minLength(column['MinimumLength']));
        }
        if (column['MaximumLength'] != undefined ) {
          validators.push(Validators.maxLength(column['MaximumLength']));
        }
        if (column['MinValueInclusive'] != undefined ) {
          validators.push(Validators.min(column['MinValueInclusive']));
        }
        if (column['MaxValueInclusive'] != undefined ) {
          validators.push(Validators.max(column['MaxValueInclusive']));
        }
        if (column['MinDate'] != undefined ) {
          validators.push(Validators.min(column['MinDate']));
        }
        if (column['MaxDate'] != undefined ) {
          validators.push(Validators.max(column['MaxDate']));
        }
        if (ctrlname == null) {
        ctrlname = column.Label; 
          if (data != null) {
            selectedDataId = data['DataId'];
          }
          
      }
        let disabled = false;
        if (this.FormMode == 'Review') {
          disabled = true; 
        }
        else if (!column['allowEditing']) { //when allowEditing is false, field should be disabled
          disabled = true;
        }
        //for displaying calculation icon
        if (column['IsCalculated'] == 'true' || column['IsCalculated'] == true || column['IsCalculated']== 1) {
          column['ShowCalcIcon'] = true;
        }

        if (data != null) { 
          grp[ctrlname] = new FormControl({ value: data[ctrlname], disabled: disabled }, validators);
        }
        else {
          grp[ctrlname] = new FormControl({ value: '', disabled: disabled }, validators); 
        }
        if (column.Calculation != undefined) { // this column is part of calculation
          grp[ctrlname].valueChanges.subscribe(x => { 
            let TargetColumnNameList: string = column.CalcTargetDFName;
            let IsTargetFormLevelField = column.IsTargetFormLevelField
            let calculation:string = column.Calculation; 
            let rawGrpValues = (<FormArray>this.dynamicFormGroup.get('' + ControlLabel)).getRawValue();//get value of complete formgroup array values
            let impactedJson: string;
            //let FormLevelField: boolean = false;
            //When calculation formula contains any aggregate fn, send complete formGrid JSON. Otherwise, send only current row JSON. 
            if (calculation.indexOf('MIN') != -1 || calculation.indexOf('MAX') != -1 || calculation.indexOf('SUM') != -1
              || calculation.indexOf('COUNT') != -1 || calculation.indexOf('AVG') != -1) { //aggregate calculation
              impactedJson = JSON.stringify(rawGrpValues);
              //FormLevelField = true;
            }
            else { //normal calculation
              let groupIndex = (+grp['groupIndex'].value['value']);//index of impacted group in the array
              impactedJson = JSON.stringify(rawGrpValues[groupIndex]);
            }
            this.GetCalculations(calculation, impactedJson, TargetColumnNameList, grp, IsTargetFormLevelField);
            //this._service.GetCalculatedValue(calculation, impactedJson, this.ProjectId).subscribe(calcValue => {
            //  //when we have multiple dependent columns then thereare multiple calculations(which result in multiple resultant value)
            //  let TargetColumnNameArray = TargetColumnNameList.split('~');
            //  if (calcValue != null) {
            //    calcValue = calcValue[0]['Result'];
            //    if (calcValue != null) { // calcValue[0]['Result'] can be null
            //      let calcValueArray = calcValue.split('~');
            //      for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
            //        let TargetColumnName = TargetColumnNameArray[calIdx];
            //        if (FormLevelField) {
            //          this.f['' + TargetColumnName].setValue(calcValueArray[calIdx]);
            //        } else {
            //          grp['' + TargetColumnName].setValue(calcValueArray[calIdx]);//setting target column value to corrsponding resultant value
            //        }
            //      }
            //    }
            //  }
            //  else {
            //    for (let calIdx = 0; calIdx < TargetColumnNameArray.length; calIdx++) {
            //      let TargetColumnName = TargetColumnNameArray[calIdx];
            //      if (FormLevelField) {
            //        this.f['' + TargetColumnName].setValue('');
            //      } else {
            //        grp['' + TargetColumnName].setValue('');//setting target column value to corrsponding resultant value
            //      }
            //    }
            //  }

            //})
          })
        } 
        if (selectedDataId != null) { 
          grp[ctrlname]['value'] = data['DataId']; //for displaying saved value in Edit form
        }
        else {
          if (column.ColumnType == "MultiColumnList") 
          grp[ctrlname]['value'] = column['dataSource'][0]['Id'];//this is for Valuetemplate, Selected first item in dropdown as valuetemplate gives error for this case.
        }
      })
    }); 
    if (this.dynamicFormGroup.get('' + ControlLabel)['length'] > 0) {
      let indexToBeUpdated = this.arrGrpIndex.findIndex(a => a.Label == ControlLabel);
      this.arrGrpIndex[indexToBeUpdated]['value'] = this.dynamicFormGroup.get('' + ControlLabel)['length']
    }
    else {
      this.arrGrpIndex.push({'Label': ControlLabel,'value': 0 });
    } 
    let arrIndex = this.arrGrpIndex.findIndex(a => a.Label == ControlLabel);
    let groupIndexValueToUse = this.arrGrpIndex[arrIndex]['value']  ;
    grp['groupIndex'] = new FormControl({ value: '' + groupIndexValueToUse  } );
    let control = new FormGroup(grp);
    //bind this newly created formgroup with the form
    (<FormArray>this.dynamicFormGroup.get('' + ControlLabel)).push(control);
    //this.grpIdx++;
  }
  //TabInfoArray = [];
  GetColumnConfigurationsForEntity() {
    //let formId = -1;
    if (this.FormId == undefined || this.FormId == null) {
      this.FormId = -1;      
    } 
    if (this.FormId != -1) {
      //get browser title
      this._formDesignerService.GetBrowserTitleForForm(this.FormId).subscribe(title => {
        this.titleService.setTitle(title);

        this._formDesignerService.GetFormTabData(this.FormId).subscribe(tabInfo => {
          let TabName = tabInfo[0]['Label']
          let tabscount = tabInfo.length;
          if (tabscount == 1 && TabName == 'DefaultTab') {
            this.ShowAsTabs = false;
          }
          else {
            this.ShowAsTabs = true;
          }
          this.TabIdsArr = tabInfo;
          let TabId = tabInfo[0]['Id'];
          
          this.TabClickArr.push({ 'TabId': TabId, 'clicked': 'yes' });
          this.GetTabData(TabId, true);//get default tab data
        })
      })
      
    }
    else {//no form implemented, so considering default tab and load all datafields
      this.ShowAsTabs = false;
      this.TabIdsArr = [{ 'Id': -1, 'Label': 'Default' }]
      this.TabClickArr.push({ 'TabId': -1, 'clicked': 'yes' });
      this.GetTabData(-1,false);
    }
  }

  GetTabData(TabId, IsDefaultTabLoad) {
    
    this._dataFieldService.DataforFormRenderer(this.EntityType, this.EntityId, '', this.TransactionId, this.LoggedInRoleId, this.FormId, TabId)
      .subscribe(ColumsData => { 
        //this.DataFieldsArray  = ColumsData;
        var newArray = [];
        newArray.push.apply(newArray, this.DataFieldsArray);
        newArray.push.apply(newArray, ColumsData);

        this.DataFieldsArray = newArray;
        //get data for TransactionId passed
        //depending upon mode, populate form field data
        if (this.FormMode == 'Create') {// -1 is create case
          this.GenerateForm(null, IsDefaultTabLoad);
        }
        else {

          this._rendererService.GetTransactionDataById(this.TransactionId, this.EntityType, this.EntityId).
            subscribe(data => {
              if (data != null && data.lenght > 0) {
                this.FormComments = data[0].Comments;

              }
              if (this.Source == 'workflow') {
                this.flexDataModel = data[0];
              }
              else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {
                if (data.length == 0 || data.length == undefined) {
                  this.refDataModel = new ReferenceDataModel();
                  this.flexDataModel = new FlexTableDataModel();
                }
                else {
                  this.refDataModel = data[0];
                }
              }

              this.GenerateForm(data[0], IsDefaultTabLoad);
            });

        }
      });
  }

  keydown(event) {

    event.stopImmediatePropagation();
  }
  get f() { return this.dynamicFormGroup.controls; }

  CalculateValidationErrors() {
    let errorCount: number = 1;
    for (let i = 0; i < this.DataFieldsArray.length; i++) {
      let ColumnName = '';
      if (this.DataFieldsArray[i].ColumnName == null && this.DataFieldsArray[i].DataType != "Text") {
        if (this.DataFieldsArray[i].UserDataType == 'SingleColumnList')
          ColumnName = 'SCL' + this.DataFieldsArray[i].Id;
        else if (this.DataFieldsArray[i].UserDataType == 'MultiColumnList')
          ColumnName = 'MCL' + this.DataFieldsArray[i].Id;
        else if (this.DataFieldsArray[i].UserDataType == 'FormGrid') {//FormGrid
          ColumnName = this.DataFieldsArray[i].Label;
          //formGrid's validations are treated separately as its reading mechanism is different
          if (this.f[ColumnName].invalid) {
            for (let j = 0; j < this.f[ColumnName]['controls'].length; j++) {
              let fgcolumns = JSON.parse(this.DataFieldsArray[i].DropdownColumns);//get columns for formcontrol
              //console.log(fgcolumns);
              for (let colInx = 0; colInx < fgcolumns.length; colInx++) {
                let column = fgcolumns[colInx];
                let colIdentifier = column.ColumnName == null ? column.Label : column.ColumnName;
                let control = this.f[ColumnName]['controls'][j]['controls']['' + colIdentifier];
                if (control.errors != null) {
                  if (control.errors.required){
                    this.ErrorMessage += (errorCount++) + ". " + column.Label  + " is required." + '\n';
                  }
                  if (control.errors.minlength) {
                    this.ErrorMessage += (errorCount++) + ". " + column.Label + " should contain atleast " + column.MinimumLength + " characters.";
                  }
                  if (control.errors.maxlength) {
                    this.ErrorMessage += (errorCount++) + ". " + column.Label + " should not exceed " + column.MaximumLength + " characters.";
                  }
                  if (control.errors.min) {
                    this.ErrorMessage += (errorCount++) + ". " + column.Label + " should not be less than " + column.MinValueInclusive + " .";
                  }
                  if (control.errors.max) {
                    this.ErrorMessage += (errorCount++) + ". " + column.Label + " should not exceed " + column.MaxValueInclusive + " .";
                  }
                 }
              }
            }
          }
       }
      }
      else {//single or multiple column list validations
        ColumnName = this.DataFieldsArray[i].ColumnName;
      }

      if (this.f[ColumnName].errors != null) {
        if (this.f[ColumnName].errors.required) {
          this.ErrorMessage += (errorCount++) + ". " + this.DataFieldsArray[i].Label + " is required." + '\n';
        }
        if (this.f[ColumnName].errors.minlength) {
          this.ErrorMessage += (errorCount++) + ". " + this.DataFieldsArray[i].Label + " should contain atleast " + this.DataFieldsArray[i].MinimumLength + " characters.";
        }
        if (this.f[ColumnName].errors.maxlength) {
          this.ErrorMessage += (errorCount++) + ". " + this.DataFieldsArray[i].Label + " should not exceed " + this.DataFieldsArray[i].MaximumLength + " characters.";
        }
        //MinValueInclusive
        if (this.f[ColumnName].errors.min) {
          this.ErrorMessage += (errorCount++) + ". " + this.DataFieldsArray[i].Label + " should not be less than " + this.DataFieldsArray[i].MinValueInclusive + " .";
        }
        if (this.f[ColumnName].errors.max) {
          this.ErrorMessage += (errorCount++) + ". " + this.DataFieldsArray[i].Label + " should not exceed " + this.DataFieldsArray[i].MaxValueInclusive + " .";
        }
      }
    }
    // this.ErrorMessage = this.ErrorMessage.slice(0,-1);//will remove last caharacter.
  }
  FormGridJson: Object[];
  FnSubmit(IsClose, IsExecuteAction, stepActionId) { 
    //let isdirty = this.dynamicFormGroup['dirty'];
    ////when form is not dirty, do not save form 
    //if (!isdirty) {
    //  this.SpinnerService.hide();
    //  this.toastObj.timeOut = 3000;
    //  this.toasts[3].content = "You have not made any changes to the form.";
    //  this.toastObj.show(this.toasts[3]);
    //  return;
    //}
    this.SpinnerService.show();
    this.ErrorMessage = ''; 
    if (this.dynamicFormGroup.invalid) {
      this.showErrors = true;
      this.CalculateValidationErrors();      
      this.SpinnerService.hide();
      return;
    }
    this.FormGridJson = [];
    //setting model's attributes columns values reading from form
    for (let i = 0; i < this.DataFieldsArray.length; i++) {
       
      if (this.DataFieldsArray[i].ColumnName != null && this.DataFieldsArray[i].ColumnName != '') {
        let fieldValue = null;
        if (this.DataFieldsArray[i].UserDataType == 'Date' || this.DataFieldsArray[i].UserDataType == 'DateTime') {
          //JSON.stringify coverts date to UTC-2, which is converting our dates to date-1 e.g 01 june2021 was cnverted to 31st May 2021 due to JSON.Stringify
          //Below conversion nullify this effect 
          fieldValue = this.dynamicFormGroup.get(this.DataFieldsArray[i].ColumnName).value;
          if (fieldValue != null && fieldValue != '') {
              fieldValue = new Date(fieldValue);
              fieldValue = new Date(fieldValue.getTime() - (fieldValue.getTimezoneOffset() * 60000)).toJSON();
          }
        }
        else {
          fieldValue = this.dynamicFormGroup.get(this.DataFieldsArray[i].ColumnName).value;
        }
        if (this.Source == 'workflow') {
          this.flexDataModel[this.DataFieldsArray[i].ColumnName] = fieldValue
        }
        else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {
          this.refDataModel[this.DataFieldsArray[i].ColumnName] = fieldValue
        }

      }
      //get form grid data if configured
      if (this.DataFieldsArray[i].ColumnName == null && this.DataFieldsArray[i].UserDataType == 'FormGrid') { 
        //let GridId = this.DataFieldsArray[i].Id;
        //let gridInstance = (document.getElementById('FG' + GridId) as any).ej2_instances[0];//get grid instance
        //var GridRowData = gridInstance.dataSource; //get grid row data
        //this.FormGridJson.push({ DataFieldId: GridId, RowData: GridRowData }); 
        let rawFormData = this.dynamicFormGroup.getRawValue();//this will fetch disabled/readonly field values as well
        let rowdata = rawFormData['' + this.DataFieldsArray[i].Label]
        //let rowdata = this.dynamicFormGroup.get('' + this.DataFieldsArray[i].Label).value;
        if (rowdata.length > 0)
          this.FormGridJson.push({ DataFieldId: this.DataFieldsArray[i].Id, RowData: rowdata });
        else {
          if (this.DataFieldsArray[i].IsMandatory) { //when required and no data in formgrid, Raise error
            this.ErrorMessage += "'" + this.DataFieldsArray[i].Label + "' should contain atleast one row";
            this.showErrors = true;
            this.SpinnerService.hide();
            return;
          }
          else
            this.FormGridJson.push({ DataFieldId: this.DataFieldsArray[i].Id, Action: 'removeall' });// for clearing any existing data where no row for formmgrid existing currently. User might have deleted the same.
        }
      }
    }
    let IsFailure;
    if (this.Source == 'workflow') {
      IsFailure = this.PopulateFlexDataModel();//populate fixed columns
    } else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {
      IsFailure = this.PopulateRefDataModel();
    }
    if (IsFailure) {
      return;
    }
    if (this.FormMode == 'Create' || this.FormMode == 'Clone') {
      this.SaveFormData(IsClose, IsExecuteAction, stepActionId);
    }
    else if (this.FormMode == 'Edit') {
      this.UpdateFormData(IsClose, IsExecuteAction, stepActionId);
    }
  }

  PopulateFlexDataModel() {
    if (this.TaggingEnabled) {// && this.FormMode == 'Create'
      if (this.SelectedTagIds == undefined || this.SelectedTagIds.length == 0) {
        this.SpinnerService.hide();
        this.toastObj.timeOut = 2000;
        this.toasts[0].content = "Please choose atleast one tag";
        this.toastObj.show(this.toasts[0]);
        
        return true;
      }
    }
    this.flexDataModel.TagIds = this.SelectedTagIds;
    console.log(this.SelectedTagIds);

    this.flexDataModel.ParameterCarrier = "|EntityId=" + this.EntityId + "|EntityType=" + this.EntityType + "|ProjectId=" + this.ProjectId
      + "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
      + "|SessionValues=" + sessionStorage;
    this.flexDataModel.ProjectId = this.ProjectId;
    this.flexDataModel.EntityId = this.EntityId;
    this.flexDataModel.EntityType = this.EntityType;
    this.flexDataModel.LoggedInUserId = +sessionStorage.getItem('LoggedInUserId');
    this.flexDataModel.LoggedInRoleId = this.LoggedInRoleId;
    this.flexDataModel.Comments = this.FormComments;
    if (this.FormMode == 'Create') {
      this.flexDataModel.FormId = this.FormId;
      this.flexDataModel.RequesterId = (sessionStorage.getItem('LoggedInUserId'));
      this.flexDataModel.RequesterRoleId = (sessionStorage.getItem('LoggedInRoleId'));
      this.flexDataModel.CreatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.flexDataModel.UpdatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.flexDataModel.CreatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.flexDataModel.UpdatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.flexDataModel.CurrentOwnerId = sessionStorage.getItem('LoggedInUserId');
      this.flexDataModel.ArrivedDateTime = new Date();
      this.flexDataModel.UpdatedDateTime = new Date();
      this.flexDataModel.CreatedDateTime = new Date();
      this.flexDataModel.Status = 'Active';
      this.flexDataModel.TxnType = this.Status;
      this.flexDataModel.FlexTableId = this.EntityId;
      this.flexDataModel.StepId = this.StepId.toString();
    } else { //Edit case
      this.flexDataModel.UpdatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.flexDataModel.UpdatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.flexDataModel.CurrentOwnerId = sessionStorage.getItem('LoggedInUserId');
      this.flexDataModel.UpdatedDateTime = new Date();
      this.flexDataModel.StepId = this.StepId.toString();
    }

  }

  PopulateRefDataModel() {
    this.refDataModel.UserId = this.UserId;
    if (this.TaggingEnabled && this.FormMode == 'Create') {
      if (this.SelectedTagIds == undefined || this.SelectedTagIds.length == 0) {
        this.SpinnerService.hide();
        this.toastObj.timeOut = 2000;
        this.toasts[2].content = "Please choose atleast one tag";
        this.toastObj.show(this.toasts[2]);
        return true;
      }
    }
    this.refDataModel.TagIds = this.SelectedTagIds;

    this.refDataModel.ParameterCarrier = "|EntityId=" + this.EntityId + "|EntityType=" + this.EntityType + "|ProjectId=" + this.ProjectId
      + "|UserName=" + sessionStorage.getItem("LoginEmail") + "|RoleName=" + sessionStorage.getItem("LoggedInRoleName")
      + "|SessionValues=" + sessionStorage;

    this.refDataModel.ProjectId = +this.ProjectId;
    this.refDataModel.EntityId = +this.EntityId;
    this.refDataModel.EntityType = this.EntityType;
    this.refDataModel.LoggedInUserId = +sessionStorage.getItem('LoggedInUserId');
    this.refDataModel.LoggedInRoleId = +sessionStorage.getItem('LoggedInRoleId');
    this.refDataModel.Comments = this.FormComments;
    if (this.FormMode == 'Create') {
      this.refDataModel.FormId = this.FormId;
      this.refDataModel.CreatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.refDataModel.UpdatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.refDataModel.CreatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.refDataModel.UpdatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.refDataModel.UpdatedDateTime = new Date();
      this.refDataModel.CreatedDateTime = new Date();
      this.refDataModel.ReferenceId = +this.EntityId;
    } else { //Edit case
      this.refDataModel.UpdatedById = (sessionStorage.getItem('LoggedInUserId'));
      this.refDataModel.UpdatedByRoleId = sessionStorage.getItem('LoggedInRoleId');
      this.refDataModel.UpdatedDateTime = new Date();
    }

  }


  SaveFormData(IsClose, IsExecuteAction, stepActionId) {
    let commonModelForJson;
    let jsonmodel: JsonModelForSP = new JsonModelForSP();
    if (this.Source == 'workflow') {
      jsonmodel.TagIds = this.flexDataModel.TagIds;
      commonModelForJson = this.flexDataModel;
    }
    else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {
      jsonmodel.TagIds = this.refDataModel.TagIds;
      commonModelForJson = this.refDataModel;

    }
    if (this.DropdownInfo_json.length > 0) {
      jsonmodel.DropdownInfo_json = JSON.stringify(this.DropdownInfo_json);
    }
    if (this.FormGridJson.length > 0) {
      jsonmodel.FormGridJson = JSON.stringify(this.FormGridJson);
    }
     
    jsonmodel.JSONStr = JSON.stringify(commonModelForJson);
    //jsonmodel.JSONStr = encodeURIComponent(strval);
    this._rendererService.SaveFormField(jsonmodel).subscribe(
      result => {
        this.TransactionId = result;
        this.SpinnerService.hide();
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Your data is saved successfully.";
        this.toastObj.show(this.toasts[1]);
        if (IsExecuteAction) {//when ExecuteAction, call execute action
          this.executeAction(stepActionId);
          return;
        } else {
          //this.Datasurce = data from db;
          if (this.Source == 'FormGrid') {
            this.ShowGridPopup = false;
          }
          setTimeout(() => {
            sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
            if (this.Source == 'workflow') {
              this.goToPrevious();
            }
            else if (this.Source == 'MasterData' || this.Source == 'Users') {
              this.goToPrevious();
              ////when Datafield is populated,donot show Edit button
              //if (this.DatafieldValue != undefined && this.DatafieldValue != null  ) {
              //  this.router.navigate(['/flexwf/RefData', this.EntityId, false]);
              //}
              //else {
              //  this.router.navigate(['/flexwf/RefData', this.EntityId, true]);
              //}
            }

          }, 3000);
        }
      },
      (error: any) => {
        this.SpinnerService.hide();
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      }
    );

  }

  UpdateFormData(IsClose, IsExecuteAction, stepActionId) {
    let commonModelForJson;
    let jsonmodel: JsonModelForSP = new JsonModelForSP();
    if (this.Source == 'workflow') {

      jsonmodel.TagIds = this.flexDataModel.TagIds;
      commonModelForJson = this.flexDataModel;
      //TransactionId = this.flexDataModel.Id;
    }
    else if (this.Source == 'MasterData' || this.Source == 'Users' || this.Source == 'FormGrid') {
      //jsonmodel.TagIds = null;
      jsonmodel.TagIds = this.refDataModel.TagIds;
      commonModelForJson = this.refDataModel;
      //TransactionId = this.refDataModel.Id;
    }
    if (this.DropdownInfo_json.length > 0) {
      jsonmodel.DropdownInfo_json = JSON.stringify(this.DropdownInfo_json);
    }
    if (this.FormGridJson.length > 0) {
      jsonmodel.FormGridJson = JSON.stringify(this.FormGridJson);
    }
    jsonmodel.JSONStr = JSON.stringify(commonModelForJson);

    console.log(jsonmodel);
    this._rendererService.UpdateFormField(jsonmodel, this.TransactionId).subscribe(
      result => {
        this.SpinnerService.hide();
        this.toastObj.timeOut = 3000;
        this.toasts[1].content = "Data updated successfully.";
        this.toastObj.show(this.toasts[1]);
        if (IsExecuteAction) {//when ExecuteAction, call execute action
          this.executeAction(stepActionId);
          return;
        } else {
          //sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
          setTimeout(() => {
            if (IsClose == true) {
              this.goToPrevious();

            } else {
              window.location.reload();
            }
          }, 3000);
        }
      },
      (error: any) => {
        this.SpinnerService.hide();
        this.toastObj.timeOut = 3000;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      });
  }

  DropdownInfo_json = [];
  gridRowSelected(e) {
    let SelectedRowDataId = e.data['Id'];
    //let SelectedGridId = +e.target.parentNode.offsetParent.offsetParent.id.split('_')[0].substring('MCL'.length)
    let SelectedGridId = +e.target.parentNode.offsetParent.id.split('_')[0].substring('MCL'.length)
    //if index is -1, item not found. item with same operation already exists, dont push it to JSON.
    let ItemIndex = this.DropdownInfo_json.findIndex(item => item.DataFieldId === SelectedGridId && item.DataId[0] === SelectedRowDataId);
    if (ItemIndex != -1) {
      let Operation = this.DropdownInfo_json[0]['Operation'];
      //if same item is selected again
      switch (Operation) {
        case 'Remove':
          this.DropdownInfo_json.splice(ItemIndex, 1); //remove that item from Json
          break;
        case 'Add':
          break;//do nothing
      }
    }
    else {// item does not exist
      let dataIdarr = []; dataIdarr.push(SelectedRowDataId);
      this.DropdownInfo_json.push({ DataFieldId: SelectedGridId, DataId: dataIdarr, Operation: 'Add' });
    }
  }
  gridRowDeselected(e) {
    let SelectedRowDataId = e.data['Id'];
    //let SelectedGridId = +e.target.parentNode.offsetParent.offsetParent.id.split('_')[0].substring('MCL'.length);
    let SelectedGridId = +e.target.parentNode.offsetParent.id.split('_')[0].substring('MCL'.length);
    //if index is -1, item not found. item with same operation already exists, dont push it to JSON.
    let ItemIndex = this.DropdownInfo_json.findIndex(item => item.DataFieldId === SelectedGridId && item.DataId[0] === SelectedRowDataId);
    if (ItemIndex != -1) {
      let Operation = this.DropdownInfo_json[0]['Operation'];
      switch (Operation) {
        case 'Add':
          this.DropdownInfo_json.splice(ItemIndex, 1); //remove that item from Json
          break;
        case 'Remove':
          break;//do nothing
      }
    }
    else {// item does not exist
      let dataIdarr = []; dataIdarr.push(SelectedRowDataId);
      this.DropdownInfo_json.push({ DataFieldId: SelectedGridId, DataId: dataIdarr, Operation: 'Remove' });

    }

  }

  SelectedGridId: number; ShowGridPopup = false;
  SelectedEntityId: number; SelectedEntityType = "";

  //This function will show the selected values/rows in the dropdown Type DataFields.
  dropdownCommon(SelectedDropdownId, SeletedDropdownData, IsMultiSelection) {
    let datArray = [];
    if (IsMultiSelection) {
      datArray = SeletedDropdownData;
    } else {
      datArray.push(SeletedDropdownData)
    }
    let ItemIndex = this.DropdownInfo_json.findIndex(item => item.DataFieldId === SelectedDropdownId);
    if (ItemIndex != -1) {
      this.DropdownInfo_json[ItemIndex]["DataId"] = datArray;
    }
    else {// item does not exist
      this.DropdownInfo_json.push({ DataFieldId: SelectedDropdownId, DataId: datArray });
    }
  }

  multiselectChange(args: any): void {
    //this is the way to get element id of multi select
    let SelectedDropdownId = +args.element.id.split('_')[0].substring('SCL'.length);
    let SeletedDropdownData = args.value;
    this.dropdownCommon(SelectedDropdownId, SeletedDropdownData, true);
  }
  ddChange(args: any): void {
    //this is the way to get element id of dropdownlist
    let SelectedDropdownId = +args.item.parentElement.id.split('_')[0].substring('SCL'.length);
    let SeletedDropdownData = args.itemData['Id'];
    this.dropdownCommon(SelectedDropdownId, SeletedDropdownData, false);
  }

  goToPrevious(): void {
    sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering

    let url = this.GetURL();
    this.router.navigateByUrl(url);
  }

  GetURL() {
    let url = sessionStorage.getItem('previousUrl');
    if (url.indexOf('generic-grid') != -1) {
      //url = url + '/' + this.StepId;
      sessionStorage.setItem("CurrentStepId", (this.StepId).toString());//we are using this in generic grid to show the CurrentStepId highLighted
    }
    return url;
  }

  MCLPopupHeader: string; ShowMCLGridPopup : boolean = false;
  MCLdataSource: any; MCLfields: any;
  MCLPopupGridId: string;
  CreatedGridId: number;
  //openGridView(id, Label, i, ParentLabel,IsFormGrid) { 
  //  let SelectedValue= '';
  //  if (IsFormGrid) {
  //    SelectedValue =this.dynamicFormGroup.getRawValue()['' + ParentLabel][i]['' + Label];
  //  }
  //  else {
  //    let UserDataType = ParentLabel;
  //    let colName = '';
  //    if (UserDataType == 'SingleColumnList')
  //      colName = 'SCL' + id;
  //    else if (UserDataType == 'MultiColumnList')
  //      colName = 'MCL' + id;
  //    SelectedValue = this.dynamicFormGroup.getRawValue()['' + colName];
  //    SelectedValue = isUndefined(SelectedValue) ? '' : SelectedValue;
  //  }
  //  this.MCLPopupHeader = Label;
  //  this.MCLPopupGridId = 'grid_' + id + '_' + i;
  //  this.CreatedGridId = id;
  //  this.ShowMCLGridPopup = true;
  //  //get ColumnList and Grid data 
  //  //this._dataFieldService.GetColumnsForMCLPopup(id).subscribe(columnsInfo => {
  //    //this.MCLfields = columnsInfo;
  //  this._dataFieldService.GetDataForMCLPopup(id, this.TransactionId, SelectedValue)
  //      .subscribe(griddata => {
  //        this.MCLdataSource = griddata;
  //        //this._dataFieldService.GetColumnsForMCLPopup(id).subscribe(columnsInfo => {
  //         // this.MCLfields = columnsInfo;
  //          this.ShowMCLGridPopup = true;
  //     // })
  //    }) 
  //}

   
  columnSelectedValues: string;

  //MCLgridRowSelected(e,gridid) {
    
  //  let SelectedRowDataId = e.data['Id'];
  //  //let parentdropdownId = e.target.parentNode.offsetParent.id.split('_')[1];
  //  let SelectedGridId = gridid;
  //  //let xx = e.target.parentNode.offsetParent.id.split('_');
  //  let xx = SelectedGridId.split('_')
  //  let parentdropdownId = 'dd_' + xx[1] + '_' + xx[2];
  //  //this.DataFieldsArray[1]['GridControls'];
  //  this.DataFieldsArray[1]['GridControls'][xx[2]]['columnSelectedValues'+1] = SelectedRowDataId
  //  //let ctrl = document.getElementById('' + parentdropdownId)
  //  //ctrl['value'] = SelectedRowDataId;
  //   this.columnSelectedValues = SelectedRowDataId; 
  //  this.ShowMCLGridPopup = false;
  //}

  readonly baseUrl = environment.baseUrl;
  formStepActions =[]
  GetFormActions() { 
    const callback2: Ajax = new Ajax(
      this.baseUrl + '/GenericGrid/GetGenericGridStepActionsByRole?StepId=' + this.StepId + '&LoggedInRoleId=' + this.LoggedInRoleId, 'GET', false, 'application/json; charset=utf-8'
    );
    callback2.onSuccess = (stepActionData: any): void => {      
      stepActionData = JSON.parse(stepActionData);
      this.formStepActions = stepActionData.filter(a => a.IsFormAction == 1);         
    };
    callback2.send().then();
  }
   

  fnExecuteAction(stepActionId, Label) { 
    let isdirty = this.dynamicFormGroup['dirty'];
    if (isdirty) {
      this.FnSubmit(false, true, stepActionId); 
    }
    else {
      this.executeAction(stepActionId);
    }

  }

  executeAction(stepActionId) {
    this._genericGridService.ExecuteAction(this.TransactionId.toString(), stepActionId, this.EntityId, this.LoggedInUserId, this.SourceId, this.FormComments)
      .subscribe(
        data => {
          if (data.indexOf('_#') > 0) {
            this.TransactionId = + data.slice(data.indexOf('#') + 1, data.indexOf('_#'));
            data = data.replace("TransactionId#" + this.TransactionId.toString() + "_#", "");
          }
          data = data.replace("1 transaction(s)", "The transaction");
          this.toastObj.timeOut = 5000;
          this.toasts[3].content = data;
          this.toastObj.show(this.toasts[3]);


          ////We are recieving Message with a prefix which will decide that at what type of Toast we will display to user. It can be Success,warning and Error
          //let MsgPrefix: string = data[0].OutputMessage.substring(0, 2);
          //let Showmsg: string = data[0].OutputMessage.substring(2, data[0].OutputMessage.length);
          //if (MsgPrefix == 'S:') {//Means success
          //  this.toasts[1].content = Showmsg;
          //  this.toastObj.show(this.toasts[1]);
          //}
          //else if (MsgPrefix == 'I:') {//Information message
          //  this.toasts[3].content = Showmsg;
          //  this.toastObj.show(this.toasts[3]);
          //}
          //else if (MsgPrefix == 'W:') {//Warning Message
          //  this.toasts[0].content = Showmsg;
          //  this.toastObj.show(this.toasts[0]);
          //}
          //else {//Error Message
          //  this.toastObj.timeOut = 3000;
          //  this.toasts[2].content = Showmsg;
          //  this.toastObj.show(this.toasts[2]);
          //}
          setTimeout(() => {
            this.goToPrevious();
          }, 5000)

        });
  }

  showHide(Id) {
    let idx = this.DataFieldsArray.findIndex(a => a.Id == Id);
    let showHideValue = this.DataFieldsArray[idx]['showHide'];
    let count = this.dynamicFormGroup.get(this.DataFieldsArray[idx]['Label'])['controls'].length;
    if (count == 0)
    {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = "Click on + button to add atleast one row to expand this section.";
      this.toastObj.show(this.toasts[2]);
      return;
    }
    if (showHideValue == undefined ||  showHideValue == null) {
      showHideValue = true;
    }
    else
      showHideValue = !showHideValue;


    this.DataFieldsArray[idx]['showHide'] = showHideValue
  }

  RecalculateData(ColumnId ,i) {
    //get field details
    this._calcService.GetByTargetDatafieldId(ColumnId, this.EntityType, this.EntityId).subscribe(data => {
      let calculation = data.TechnicalCalculation;
      let IsFormGrid = data.IsFormGrid;
      let ControlLabel = data.FormGridName;
      let impactedJson: string;
      let IsTargetFormLevelField = data.IsTargetFormLevelField;
      //let FormLevelField: boolean = false;
      let group = null;
      if (IsFormGrid) {
        //console.log(this.dynamicFormGroup.getRawValue());
        //let rawGrpValues = this.dynamicFormGroup['controls']['' + ControlLabel]['controls'].getRawValue()
        //let formData = this.dynamicFormGroup.getRawValue()
        //console.log(formData);
        //console.log(this.dynamicFormGroup.get('' + ControlLabel));
        let rawGrpValues;// = formData['Individual Results Score']; 
          rawGrpValues = (<FormArray>this.dynamicFormGroup.get('' + ControlLabel)).getRawValue();//get value of complete formgroup array values
         
        //When calculation formula contains any aggregate fn, send complete formGrid JSON. Otherwise, send only current row JSON. 
        if (calculation.indexOf('MIN') != -1 || calculation.indexOf('MAX') != -1 || calculation.indexOf('SUM') != -1
          || calculation.indexOf('COUNT') != -1 || calculation.indexOf('AVG') != -1) { //aggregate calculation
          impactedJson = JSON.stringify(rawGrpValues);
          //FormLevelField = true;
        }
        else { //normal calculation
          impactedJson = JSON.stringify(rawGrpValues[i]);
        }
        if (i != null) {//when i is populated that means its part of some formGrid and calc has to be performed on particular row
          group = this.dynamicFormGroup.get('' + ControlLabel)['controls'][i]['controls'];
        }
      }
      else {
        //FormLevelField = true;
        group = this.dynamicFormGroup.getRawValue();
        impactedJson = JSON.stringify(this.dynamicFormGroup.getRawValue());
      }
      
      this.GetCalculations(calculation, impactedJson, data.ColumnName, group, IsTargetFormLevelField);

    })
  }

  ShowContentPopup: bool; popupHeader: string = ""; PopupContent: string = "";
  OpenPopup(Id,ColumnName,Label,IsFormGridControl,i,ParentLabel) {
    let val=""
    if (IsFormGridControl) {
      val = this.dynamicFormGroup.controls['' + ParentLabel]['controls'][i].controls['' + ColumnName].value
    } else {
      val = this.dynamicFormGroup.controls['' + ColumnName].value;
    }
    this.PopupContent = val;
    this.popupHeader = Label;
    this.ShowContentPopup = true;
  }
}

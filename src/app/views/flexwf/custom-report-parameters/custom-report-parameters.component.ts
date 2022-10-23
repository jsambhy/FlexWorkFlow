import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router'; 
import { GridComponent } from '@syncfusion/ej2-angular-grids'; 
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ReportService } from '../../../services/report.service';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-custom-report-parameters',
  templateUrl: './custom-report-parameters.component.html',
  styleUrls: ['./custom-report-parameters.component.css']
})
/** CustomReportParameters component*/
export class CustomReportParametersComponent {
  toolbar: object; 
  ReportParamForm: FormGroup = null;

  @Input() ReportId: number;
  paramfields: Object = { text: 'Label', value: 'Label' };
  operators: Object = [];
  LoggedInUserId = + sessionStorage.getItem('LoggedInUserId');
  @ViewChild('ReportParam', { static: false })
  public ReportParamGrid: GridComponent;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  @Output() PostParamJsonEvent = new EventEmitter<string>();



  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
    
   public OperatorDataSource = [ 
     { text: 'Equal', value: 'Equal' },
     { text: 'Not Equal', value: 'Not Equal' },
     { text: 'Contains', value: 'Contains' },
     { text: 'Starts With', value: 'StartsWith' },
     { text: 'Ends With', value: 'Ends With' },
     { text: 'Less Than', value: '<' },
     { text: 'Less Than or Equal', value: '<=' },
     { text: 'Greater Than', value: '>' },
     { text: 'Greater Than or Equal', value: '>=' },    
     { text: 'Between', value: 'Between' }
   ];

   //public EmpFields: Object = { text: 'LoginEmail', value: 'LoginEmail' };
  LoggedInRoleId: number;  LoggedInScopeEntityId: number;  LoggedInScopeEntityType: string;
   
  constructor(private formBuilder: FormBuilder,
    private _service: ReportService
    , private route: ActivatedRoute, private router: Router,  ) {

    //this.ReportParamForm = formdataormBuilder.group({
    //  PeriodOperator: new FormControl(''),
    //  PeriodValue: new FormControl(''),
    //  EmpOperator: new FormControl(''),
    //  EmpValue: new FormControl('')
    //}); 
    this.LoggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");     this.LoggedInScopeEntityId = +sessionStorage.getItem("LoggedInScopeEntityId");    this.LoggedInScopeEntityType = sessionStorage.getItem("LoggedInScopeEntityType");

  }

  ReportFieldsArray = []; 
  ngOnInit() { 
    this._service.GetDataForReportParameterForm(this.ReportId).subscribe(data => {
      this.ReportFieldsArray = data;
      this.GenerateForm();
    })
   
  }
  OnOperatorChange(args, FormControlName,i) { 
    if (args.value == 'Between') {
      this.ReportFieldsArray[i]['ShowHideV2Block'] = true;
    }
    else {
      this.ReportFieldsArray[i]['ShowHideV2Block'] = false;
    }
  }

  GenerateForm() { 
    let group = {};
    for (let index = 0; index < this.ReportFieldsArray.length;) {
      let l_DataField = this.ReportFieldsArray[index];

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
      let controlName = l_DataField.FormName;
      let ctrl1 = 'V' + controlName;
      let ctrl2 = 'VV' + controlName;
      //let Ctrl1 = 
      if (l_DataField.UserDataType == 'SingleColumnList' || l_DataField.UserDataType == 'MultiColumnList') {
        let dropdownData = JSON.parse(l_DataField.DropdownData);
        this.ReportFieldsArray[index]["dataSource"] = dropdownData;//setting datasource
        let columnsinfo = JSON.parse(l_DataField.DropdownColumns);
        this.ReportFieldsArray[index]["fields"] = { text: columnsinfo[0]['Label'], value: columnsinfo[0]['Label'] };
      }

      this.ReportFieldsArray[index]['ShowHideV2Block'] = false;

      if (l_DataField.UserDataType == 'SingleColumnList' || l_DataField.UserDataType == 'MultiColumnList') {
        group[ctrl1] = new FormControl(validators);
        this.ReportParamForm = this.formBuilder.group(group);
        group['Operator' + controlName] = new FormControl({ value: '' });
        this.ReportParamForm = this.formBuilder.group(group);
        //V2 block refers to value2 block which is hidden initially
        group[ctrl2] = new FormControl();
        this.ReportParamForm = this.formBuilder.group(group);
      }
      else {
        group['V1'+controlName] = new FormControl({ value: '' }, validators);      
        this.ReportParamForm = this.formBuilder.group(group);
        group['Operator' + controlName] = new FormControl({ value: '' });
        this.ReportParamForm = this.formBuilder.group(group);
        //V2 block refers to value2 bloack which is hidden initially
        group['V2' + controlName] = new FormControl({ value: '' }, validators);
        this.ReportParamForm = this.formBuilder.group(group);
      }
      

      index++;
    }

  }
  
  showErrors = false;
  SaveParams() {
    
    if (this.ReportParamForm.invalid) {
      this.showErrors = true;
      this.CalculateValidationErrors();
      //this.SpinnerService.hide();
      return;
    }
     
    var formdata = this.ReportParamForm.getRawValue();
    console.log(formdata);
    var jsnstring = '{ "UserProvided":[';
    var fixedJson = '"Fixed": [{ "@UserId": ' + this.LoggedInUserId + ', "@RoleId": ' + this.LoggedInRoleId + ', "@EntityType": "' + this.LoggedInScopeEntityType + '", "@EntityId": ' + this.LoggedInScopeEntityId + ' }]} ';
    for (let index = 0; index < this.ReportFieldsArray.length; index++) {
      let UserDataType = this.ReportFieldsArray[index]['UserDataType']
      //formdata['VPeriod'].length
      let FormName = this.ReportFieldsArray[index]['FormName'];
      let ctrl1 = 'V1' + FormName;
      let ctrl2 = 'V2' + FormName;
      if (UserDataType == 'SingleColumnList' || UserDataType == 'MultiColumnList') {
        ctrl1 = 'V' + FormName;
        ctrl2 = 'VV' + FormName;
      }
      let Label = this.ReportFieldsArray[index]['Label'];
      let fieldValue1 = formdata[ctrl1] 
      let fieldValue2 = formdata[ctrl2];
      let operatorValue = formdata['Operator' + FormName];
      let betweenFlag: boolean = false;
      let IsMandatory = this.ReportFieldsArray[index]['IsMandatory'];
      if (IsMandatory == 1 && (fieldValue1 == "" || fieldValue1.length == 0)) {
        this.toastObj.timeOut = 0;        this.toasts[2].content = "Please provide value for - " + Label;        this.toastObj.show(this.toasts[2]);
        return;
      }

      switch (operatorValue) {
        case "Equal":
          if (fieldValue1.length == 1) //when selected values are only 1, use = otherwise use 'IN' for efficiency
            operatorValue = '=';
          else {
            operatorValue = 'IN';
            let arr: [];
            arr = fieldValue1;
            fieldValue1 = arr.join('^,^');
          }
          break;
        case "Not Equal":
          if (fieldValue1.length == 1)//when selected values are only 1, use = otherwise use 'IN' for efficiency
            operatorValue = '!=';
          else {
            operatorValue = 'NOT IN';
            let arr: [];
            arr = fieldValue1;
            fieldValue1 = arr.join('^,^');
          }
          break;
        case "Contains":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }

          operatorValue = 'like';
          fieldValue1 = '%' + fieldValue1 + '%';
          break;
        case "Starts With":
        case "StartsWith":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = 'like';
          fieldValue1 = '%' +  fieldValue1;
          break;
        case "Ends With": 
        case "EndsWith": if (fieldValue1.length > 1) {
          this.toastObj.timeOut = 0;          this.toasts[2].content = "Please select only one value for - " + Label ;          this.toastObj.show(this.toasts[2]);
          return;
        }
          operatorValue =
            'like';
          fieldValue1 = fieldValue1 + '%';
          break;
        case "Less Than":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = '<';
          break;
        case "Less Than or Equal":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = '<=';
          break;
        case "Greater Than":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = '>';
          break;
        case "Greater Than or Equal":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = '>=';
          break;
        case "Between":
          if (fieldValue1.length > 1) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please select only one value for - " + Label ;            this.toastObj.show(this.toasts[2]);
            return;
          }
          operatorValue = 'Between';
          betweenFlag = true;
          if (fieldValue2 == '' || fieldValue2 == null || fieldValue2 == undefined) {
            this.toastObj.timeOut = 0;            this.toasts[2].content = "Please provide Value2.";            this.toastObj.show(this.toasts[2]);
            return;
          }
          break;
        default: operatorValue = operatorValue;
      }
      //
      
      if (betweenFlag) {
        //fieldValue2 = fieldValue2.join('^,^');
        jsnstring += '{ "' + Label + '": { "Operator": "' + operatorValue + '", "value1": "^' + fieldValue1 + '^" , "value2": "^' + fieldValue2 + '^" } },'
      }
      else {
        jsnstring += '{ "' + Label + '": { "Operator": "' + operatorValue + '", "value1": "^' + fieldValue1 + '^" } },'
      }

    }
    jsnstring = jsnstring.substring(0, jsnstring.length - 1);
    jsnstring += '],' + fixedJson;
    console.log(jsnstring);
    this.PostParamJsonEvent.emit(jsnstring);
    

  }

  ErrorMessage = '';
  CalculateValidationErrors() {
    var formdata = this.ReportParamForm.getRawValue();

    let errorCount: number = 1;
    for (let i = 0; i < this.ReportFieldsArray.length; i++) {
      let FormName = this.ReportFieldsArray[i]['FormName'];
      let ctrl1 = 'V1' + FormName;
      let ctrl2 = 'V2' + FormName;
      let UserDataType = this.ReportFieldsArray[i]['UserDataType']
      if (UserDataType == 'SingleColumnList' || UserDataType == 'MultiColumnList') {
        ctrl1 = 'V' + FormName;
        ctrl2 = 'VV' + FormName;
      }
      let ColumnName = ctrl1;
       

      if (formdata[ColumnName].errors != null) {
        if (formdata[ColumnName].errors.required) {
          this.ErrorMessage += (errorCount++) + ". " + this.ReportFieldsArray[i].DisplayName + " is required." + '\n';
        }
        if (formdata[ColumnName].errors.minlength) {
          this.ErrorMessage += (errorCount++) + ". " + this.ReportFieldsArray[i].DisplayName + " should contain atleast " + this.ReportFieldsArray[i].MinimumLength + " characters.";
        }
        if (formdata[ColumnName].errors.maxlength) {
          this.ErrorMessage += (errorCount++) + ". " + this.ReportFieldsArray[i].DisplayName + " should not exceed " + this.ReportFieldsArray[i].MaximumLength + " characters.";
        }
        //MinValueInclusive
        if (formdata[ColumnName].errors.min) {
          this.ErrorMessage += (errorCount++) + ". " + this.ReportFieldsArray[i].DisplayName + " should not be less than " + this.ReportFieldsArray[i].MinValueInclusive + " .";
        }
        if (formdata[ColumnName].errors.max) {
          this.ErrorMessage += (errorCount++) + ". " + this.ReportFieldsArray[i].DisplayName + " should not exceed " + this.ReportFieldsArray[i].MaxValueInclusive + " .";
        }
      }
    }
  }

}

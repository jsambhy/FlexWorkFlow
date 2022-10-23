import { ViewChild,Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../../services/auth';
import {
  GridLine,  GridComponent, ToolbarService, EditService, PageService, 
   FreezeService,  SelectionSettingsModel, ToolbarItems, ReorderService, FilterSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ChangePasswordModel, ChangeSecurityQuestionsModel, QuestionsModel, LogActivityViewModel  } from '../../../models/loginModel';

@Component({
  selector: 'app-change-security-questions',
  templateUrl: './change-security-questions.component.html',
  providers: [ ReorderService, ToolbarService, EditService, PageService, FreezeService]
})
export class ChangeSecurityQuestionsComponent implements OnInit  {
  model: ChangeSecurityQuestionsModel = new ChangeSecurityQuestionsModel();
  loggedInUserId: string;
  returnUrl: string;
  @ViewChild('WFgrid', { static: false })
  public WFgrid: GridComponent;
  public lines: GridLine;
  public toolbar: ToolbarItems[] | object;
  public filterSettings: FilterSettingsModel;
  questionData: QuestionsModel[];
  public editSettings: Object;
  public selectionOptions: SelectionSettingsModel;
  QuestionNumber = 1;
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  QuestionCount: 0;
  constructor(
    private router: Router,
    private AccountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.model.QuestionList = [new QuestionsModel()];
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.loggedInUserId = params['UserId'];
      
      //this.model.Email = params['Email'];
    });
    this.model.UserId = +this.loggedInUserId;
    //this.returnUrl = "/dashboard";
  }

  ngOnInit() {
   this.lines = 'Both';//indicated both the lines in grid(horizontal and vertical)   
    this.toolbar = ['Edit'/*,'Update'*/,'Cancel'];//toolbar options need to show in grid
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' };//inline editing
    this.filterSettings = { type: 'Excel' };
    this.selectionOptions = { type: 'Multiple' };
    this.AccountService.GetSecurityQuestions(this.loggedInUserId).subscribe(
      result => {
        if (result.length > 0) {
          this.questionData = result;
        }
        else {
          this.questionData = [{ 'Question': 'Double Click to update', 'Answer': 'Double Click to update', 'Answerhint': '' },
            { 'Question': 'Double Click to update', 'Answer': 'Double Click to update', 'Answerhint': '' },
            { 'Question': 'Double Click to update', 'Answer': 'Double Click to update', 'Answerhint': '' }];
        }
      },

    );
  }

  dataBound() {
    this.WFgrid.autoFitColumns();//automatically adjust the columns width as per the content
  }

  public actionComplete(args) {

    if ((args.requestType === 'beginEdit')) {
      const dialog = args.dialog;
      // change the header of the dialog
      dialog.header =  'Question Details';
    }
  }
  toolbarClick(args: ClickEventArgs): void {
    //alert("click");
  }
  public saveQuestions() {
    
    //Select all grid rows so as we can get selected rows data
    this.WFgrid.selectRows([0, 1, 2]);
    let GridRows:Object[] = this.WFgrid.getSelectedRecords();
    let index: number = 0;
    this.model.QuestionList = [];
    //this.model.QuestionList.pop();
    for (let row of GridRows) {
      if (row['Question'] == '' ) {
        //alert("Please fill question");
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Please fill all questions";
        this.toastObj.show(this.toasts[2]);
        return;
      }
      if (row['Question'] == 'Double Click to update') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Please update all questions";
        this.toastObj.show(this.toasts[2]);
        return;
      }
      if (row['Answer'] == '') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Please fill all answers";
        this.toastObj.show(this.toasts[2]);
        return;
      }
      if (row['Answer'] == 'Double Click to update') {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Please update all answers";
        this.toastObj.show(this.toasts[2]);
        return;
      }
      if (row['Answer'] == row['Answerhint']) {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = "Please make sure hint is different from answer for security reasons.";
        this.toastObj.show(this.toasts[2]);
        return;
      }
      this.questionData[index].Question = row['Question'];//set question
      this.questionData[index].Answer = row['Answer'];
      this.questionData[index].Answerhint = row['Answerhint'];
      this.model.QuestionList.push(this.questionData[index]);
      index = index + 1;
    }
    this.AccountService.ChangeSecurityQuestions(this.model).subscribe(
      result => {
        if (result) {
          this.AccountService.GetUserInfo(this.loggedInUserId)
            .subscribe(user => {
              let logModel: LogActivityViewModel = new LogActivityViewModel();
              logModel.Activity = 'QuestionsUpdated';
              logModel.Remarks = 'QuestionsUpdated';
              logModel.IsActivitySuccess = true;
              logModel.ReturnUrl = "/dashboard";
              this.AccountService.setSessionVariablesAndLogActivity(user, logModel);
            },
              (error: any) => {
                this.toastObj.timeOut = 3000;
                this.toasts[2].content = error.error["Message"];
                this.toastObj.show(this.toasts[2]);
              }
            );
        }
      }
    );
  }

  public cancel() {
    let userId = sessionStorage.getItem('LoggedInUserId');
    //if (userId != null) {
    //  this.router.navigate(['/flexwf/UserSettings']);
    //}
    //else {
      this.router.navigate(['']);
    //}
  }
}


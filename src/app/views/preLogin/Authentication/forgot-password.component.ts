import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AccountService } from '../../../services/auth';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { ChangeSecurityQuestionsModel, QuestionsModel, ForgotPasswordViewModel } from '../../../models/loginModel';
import { environment } from '../../../../environments/environment';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit  {

  readonly AuthSource = environment.AuthSource;
  model: ChangeSecurityQuestionsModel = new ChangeSecurityQuestionsModel();
  loggedInUserId: any;
  Email: string;

  returnUrl: string;
  displayQuestion: string;
  displayAnswer: string;
  currentQuestionId: number;
  questionData: QuestionsModel[];
  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;
  public toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: '', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: '', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: '', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: '', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  public position: ToastPositionModel = { X: 'Center' };
  constructor(
    private router: Router,
    private AccountService: AccountService,
    private route: ActivatedRoute
  ) {
    this.model.QuestionList = [new QuestionsModel()];
    //getting the id from the url
    this.route.params.subscribe((params: Params) => {
      this.Email = params['Email'];
    });
  }
  RetryCounter: number;
  Retry: boolean = false;
  ngOnInit() {
    if (localStorage.getItem('RetryCounter') == (undefined  || 'NaN' || '' || null)) {
      this.RetryCounter = 0;
    }
    else {
      this.RetryCounter++;
    }
    if (this.RetryCounter == 5) {
      this.toastObj.timeOut = 3000;
      this.toasts[2].content = "You did not answer the question.Please contact Support.";
      this.toastObj.show(this.toasts[2]);
      setTimeout(() => { this.router.navigate(['']); }, 3000);
      //this.router.navigate(['']);
    }
    localStorage.setItem('RetryCounter', '' + this.RetryCounter++);
    
    this.AccountService.GetUserIdByUserName(this.Email).subscribe(
      result => {
        this.loggedInUserId = result;
        this.AccountService.GetSecurityQuestions(result).subscribe(
          result => {
            if (result.length < 3) {
              this.toastObj.timeOut = 3000;
              this.toasts[2].content = "There are no security questions for this user. Please contact to L2 Support.";
              this.toastObj.show(this.toasts[2]);
              setTimeout(() => { this.router.navigate(['']); }, 3000);
             
            }
            
            this.questionData = result;
            this.currentQuestionId = this.questionData[0].Id;
            this.displayQuestion = this.questionData[0].Question;
          }
        );
      }
    );
    
  }

  public Verify(answer) {
    
    if (answer == '') {
      this.toastObj.timeOut = 0;
      this.toasts[2].content = "Answer is required";
      this.toastObj.show(this.toasts[2]);
      return;
    }
    let ForgotPasswordModel: ForgotPasswordViewModel = new ForgotPasswordViewModel();
    ForgotPasswordModel.Id = this.currentQuestionId;
    ForgotPasswordModel.Answer = answer;
    ForgotPasswordModel.UserId = parseInt(this.loggedInUserId);
    this.AccountService.VerifyQuestion(ForgotPasswordModel).subscribe(result => {
      if (result) {
        if (this.AuthSource == 'Cognito') {
          Auth.forgotPassword(this.Email)
            .then(data => {
              console.log(data);
              this.router.navigate(['/prelogin/SetPassword', this.Email, this.loggedInUserId]);
              //this.router.navigate(['/prelogin/CheckOtp', this.Email, this.loggedInUserId]);
            })
            .catch(err => {
              console.log(err);
            });
        }
        else {
          this.AccountService.GenerateOTPnSendMail(this.loggedInUserId).subscribe(OTPStatus => {
            console.log(OTPStatus);
            this.router.navigate(['/prelogin/SetPassword', this.Email, this.loggedInUserId]);
            //this.router.navigate(['/prelogin/CheckOtp', this.Email, this.loggedInUserId]);
          });
        }
       
      }
     
    },
      (error: any) => {
        this.toastObj.timeOut = 0;
        this.toasts[2].content = error.error["Message"];
        this.toastObj.show(this.toasts[2]);
      });
    
  }
}


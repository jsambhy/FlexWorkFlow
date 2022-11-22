import { Component, ViewChild } from '@angular/core';  
import { environment } from '../../../../environments/environment'; 
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormRendererService } from '../../../services/form-renderer.service';
import { FilterSettingsModel, GridLine } from '@syncfusion/ej2-angular-grids';
import { RWorkFlows } from '../../../models/rworkflow-model';
import { RworkFlowsService } from '../../../services/rworkflows.service';
import { SupportingDocumentService } from '../../../services/supporting-document.service';
import { ToastComponent, ToastPositionModel } from '@syncfusion/ej2-angular-notifications';
import { MasterDataService } from '../../../services/master-data.service';
import { LReferenceModel } from '../../../models/lreference-model';


@Component({
  selector: 'app-transaction-uploader',
  templateUrl: './transaction-uploader.component.html',
  styleUrls: ['./transaction-uploader.component.css'] 
})

export class TransactionUploadComponent {
  baseUrl = environment.baseUrl;
  showUploader = false;
  gridData: any;
  EntityType: string;
  EntityId: number;
  ProjectId: number;
  public filterSettings: FilterSettingsModel;
  public editSettings: Object;
  //define grid properties
  public lines: GridLine;
  public loggedInUserId: number;
  public loggedInRoleId: number;
  public WorkflowsDetails: RWorkFlows;
  public MasterDataDetails: LReferenceModel;
  public S3BucketRootFolder: any;
  public FilePath: string;
  public uploadPath: string;
  ProjectName: string;
  underlyingEntityId: number;//this is workflowid or ReferenceId
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
  Previous: string;
  constructor(private router: Router, private route: ActivatedRoute,
    private _rendererService: FormRendererService,
    private _serviceRWorkflows: RworkFlowsService,
    private _SupportDocService: SupportingDocumentService,
    private _serviceMasterData: MasterDataService  ) {
    //read querystring params
    this.route.params.subscribe((params: Params) => {
      this.EntityType = params['EntityType'];
      this.EntityId = +params['EntityId'];
      this.underlyingEntityId = +params['underlyingEntityId'];
      //get previous url
      if (this.router.getCurrentNavigation().previousNavigation != null) {
        this.Previous = this.router.getCurrentNavigation().previousNavigation.finalUrl.toString();
        sessionStorage.setItem('previousUrl', this.Previous);
      }
    });
    this.ProjectId = +sessionStorage.getItem("ProjectId");
    this.loggedInUserId = +sessionStorage.getItem("LoggedInUserId");
    this.loggedInRoleId = +sessionStorage.getItem("LoggedInRoleId");
    this.lines = 'Both';
    this.editSettings = { allowEditing: true, allowAdding: true, /*allowDeleting: true,*/ mode: 'Dialog' };
    this.filterSettings = { type: 'Excel' };
    this.ProjectName = sessionStorage.getItem("DefaultEntityName");
    if (this.EntityType == 'FlexTables') {
      //Getting workflow details
      this._serviceRWorkflows.GetWorkflowById(this.underlyingEntityId)
        .subscribe(
          data => {
            this.WorkflowsDetails = data;
            this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/workflow/" + this.WorkflowsDetails.UILabel;
            this.uploadPath =  this.FilePath + "/uploads"
            this.ProjectId = +sessionStorage.getItem("ProjectId");
          }
        );
    }
    else if (this.EntityType == 'LReferences') {
      //Getting workflow details
      this._serviceMasterData.GetById(this.underlyingEntityId)
        .subscribe(
          data => {
            this.MasterDataDetails = data;
            this.FilePath = "/" + this.ProjectId + "_" + this.ProjectName + "/masterdata/" + this.MasterDataDetails.Name;
            this.uploadPath = this.FilePath + "/uploads"
            this.ProjectId = +sessionStorage.getItem("ProjectId");
          }
        );
    }
    let S3BucketRootFolder = environment.S3BucketRootFolder;
    
    this.GetGridData();
  }
  public GetGridData() {
    this._rendererService.GetLobbyInfo(this.EntityType, this.EntityId, this.ProjectId)
      .subscribe(result => {
        this.gridData = result; 
      }); 
  }
  //This event will be called after uploading the file
  PostUploadEvent(event) {
    console.log(this.uploadPath);
    var UploadedFileInfo = JSON.parse(sessionStorage.getItem("UploadedFile"));
    if (UploadedFileInfo != null) {
      this._rendererService.ReadAndValidateExcelData(UploadedFileInfo[0]['FileName'], this.EntityType, this.EntityId,
        this.ProjectId, this.loggedInUserId, this.loggedInRoleId, 'DeltaLoad')
        .subscribe(data => {
          this.GetGridData();
        },
          (error: any) => {
            this.toastObj.timeOut = 3000;
            this.toasts[2].content = error.error["Message"];
            this.toastObj.show(this.toasts[2]);
          }); 
    }
  }

 
  fnImportData(LobbyId) {
    let BaseTable: string;
    if (this.EntityType == 'FlexTables') {
      BaseTable = "FlexTableData";
     
    }
    else {
      BaseTable = "LReferenceData";
      
    }
    this._rendererService.ImportTransactions(LobbyId, BaseTable).
      subscribe(data => {
        this.GetGridData();
      },
        (error: any) => {
          this.toastObj.timeOut = 3000;
          this.toasts[2].content = error.error["Message"];
          this.toastObj.show(this.toasts[2]);
        }); 
  }

  fnDownloadErrors(LobbyId) {
    this._rendererService.DownloadUploadErrors(LobbyId).subscribe(FileName => {
      this._SupportDocService.DownloadFromS3(this.uploadPath + "/errors/" + FileName);
    });
  }

  fnDownloadFile(FileName) {
    this._SupportDocService.DownloadFromS3(this.uploadPath + "/" + FileName);
  }
  OpenUploader() {
    sessionStorage.removeItem("UploadedFile");
     this.showUploader = true;
  }
  goToPrevious(): void {
    sessionStorage.setItem("IsAuth", "true");//This is to stop url tempering
    this.router.navigate ([this.Previous]);
  }
}





import { Component, ViewChild, Input, ElementRef } from '@angular/core';
import { FilterSettingsModel, ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { SupportingDocumentService } from '../../../services/supporting-document.service';

import * as AWS from 'aws-sdk';
import { environment } from '../../../../environments/environment';
import { ToastPositionModel, ToastComponent } from '@syncfusion/ej2-angular-notifications';
import { SupportingDocumentViewModel } from '../../../models/supportingDocModel';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';

@Component({
    selector: 'app-supporting-doc',
    templateUrl: './supporting-doc.component.html',
    styleUrls: ['./supporting-doc.component.css']
})
/** SupportingDoc component*/
export class SupportingDocComponent {

  filterSettings: FilterSettingsModel;
  toolbar: ToolbarItems[] | object;
  @Input() EntityType: string;
  @Input() EntityId: number;//In case of create it will be -1
  @Input() TargetPath: string;
  @Input() IsMultipleFilesAllowed: boolean;
  @Input() AllowedFileTypes: string;
  @Input() StepId: number;
  dataSource: any[];
  showDialogBox: boolean = false;
  LoggedInRoleId: number = +sessionStorage.getItem("LoggedInRoleId");
  LoggedInUserId: number = +sessionStorage.getItem("LoggedInUserId");
  ProjectId: number = +sessionStorage.getItem("ProjectId");
  Source: string = "Supporting Documents";

  @ViewChild('SupportingDocGrid', { static: false })
  public SupportingDocGrid: GridComponent;

  @ViewChild('suppDocComments', { static: false })
  public SupportingDocComments: TextBoxComponent;

  @ViewChild('downloadZipLink', { static: false })
  private downloadZipLink: ElementRef;

  @ViewChild('toasttype', { static: false })
  private toastObj: ToastComponent;

  //toast definition
  toasts: { [key: string]: Object }[] = [
    { title: 'Warning!', content: 'There was a problem with your network connection.', cssClass: 'e-toast-warning', icon: 'e-warning toast-icons' },
    { title: 'Success!', content: 'Your message has been sent successfully.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
    { title: 'Error!', content: 'A problem has been occurred while submitting your data.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
    { title: 'Information!', content: 'Please read the comments carefully.', cssClass: 'e-toast-info', icon: 'e-info toast-icons' }
  ];
  position: ToastPositionModel = { X: 'Center' };
  SupportingDocument: SupportingDocumentViewModel = new SupportingDocumentViewModel();
 

  constructor(private _service: SupportingDocumentService) {
   
    }

  ngOnInit() {
     
    this.filterSettings = { type: 'CheckBox' }; // inorder to remove extra filtering from the grid we set it to this type.
    this.toolbar = [{ text: 'Add', tooltipText: 'Add', prefixIcon: 'e-custom-icons e-action-Icon-add', id: 'Add' }, { text: 'Delete', tooltipText: 'Delete', prefixIcon: 'e-custom-icons e-action-Icon-delete3', id: 'Delete' }, { text: 'Download', tooltipText: 'Download', prefixIcon: 'e-custom-icons e-action-Icon-downloadattachement2', id: 'Download' }];
    //if (this.AllowedFileTypes == null || this.AllowedFileTypes == undefined)
    //{
    //  this.AllowedFileTypes = ".xlsx,.sql,.pdf";//This will pick from GProject table, hard coded is just for poc
    //}

    this.GetSupportingDocuments();
  }

  GetSupportingDocuments()
  {
   
    this._service.getSupportingDocByEntityType(this.EntityType, this.EntityId)
      .subscribe(
        data => {
          this.dataSource = (data);
        }
      );
  }

  toolbarClick(args: ClickEventArgs): void {
    //if (args.item.id === 'SupportingDocGrid_pdfexport') {
    //  this.SupportingDocGrid.pdfExport();
    //}
    //if (args.item.id === 'SupportingDocGrid_excelexport') {
    //  this.SupportingDocGrid.excelExport();
    //}
    //if (args.item.id === 'SupportingDocGrid_csvexport') {
    //  this.SupportingDocGrid.csvExport();
    //}
    if (args.item.id === 'Add') {
      this.showDialogBox = true;
     
    }
    if (args.item.id === 'Delete') {
      var selectedRecord = this.SupportingDocGrid.getSelectedRecords();
      if (selectedRecord.length == 0) {
        this.toasts[3].content = "No File selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {

        if (selectedRecord[0]['Id'] == undefined || selectedRecord[0]['Id'] == null)//It means supporting doc are not the part of Entity yet, it just the part of session and user want to remove it
        {
          //It will delete rows from Grid
          this.dataSource = this.dataSource.filter(x => x.FileName != selectedRecord[0]['FileName']);
          this.SupportingDocGrid.refresh();

          //delete from session because we dont need to attach this file with Entity
          let SupportingDataSource = JSON.parse(sessionStorage.getItem("supportingDocumentList"));

          //we are taking doc extra variable because filter function not applicable on directly SupportingDataSource
          let docs = [];
          docs = this.dataSource;
          SupportingDataSource = docs.filter(x => x.FileName != selectedRecord[0]['FileName']);
          sessionStorage.setItem("supportingDocumentList", JSON.stringify(SupportingDataSource));

        }
        else {

          //In that case we will only update the IsDeleted Flag
          this._service.DeleteSupportingDocById(selectedRecord[0]['Id'], this.EntityType, this.EntityId, this.LoggedInUserId, this.LoggedInRoleId)
            .subscribe(
              data => {
                this.GetSupportingDocuments();
                this.SupportingDocGrid.refresh();
              }
            );
        }
      }
    }

    if (args.item.id === 'Download') {
      var selectedRecord = this.SupportingDocGrid.getSelectedRecords();
      var selectedRecord = this.SupportingDocGrid.getSelectedRecords();
      if (selectedRecord.length == 0) {
        this.toasts[3].content = "No File selected for this operation";
        this.toastObj.show(this.toasts[3]);
      }
      else {
        this._service.getSupportingDocById(selectedRecord[0]['Id'])
          .subscribe(
            SupportingDocInfo => {
              //this._service.DownloadFromS3(SupportingDocInfo.FilePath, SupportingDocInfo.FileName);
              this._service.DownloadFromS3(SupportingDocInfo.FilePath + "/" +SupportingDocInfo.FileName);
            }
          );
      }
      
     
    }
  }

  

  //This event will called after coming back from Uploader component.  we are appending data of recently uploaded files in Grid.
  //recently uploaded files are only the part of session not attached with entity but we need to show them in Grid
  //In case of Create we will show only the session data but in case of Edit we need to append the session data in already existing datasource
  PostUploadEvent() {
    let GridData = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
    if (this.EntityId == -1 || this.EntityId == 0 || this.EntityId == undefined)//This is the case of create
    {
      this.dataSource = GridData;//It will show only session data
      //Store Supporting Documents comments in session
      sessionStorage.setItem("SupportingDocComments", this.SupportingDocComments.value);
    }
    else {//This is the case of Edit
      for (let i = 0; i < GridData.length; i++) {
        this.dataSource.push(GridData[i]);//it will append session data in already existing data source
      }

      //Now attach this newly added supporting document with Entity means do the database table entry.
      //This will happen only in case of edit because it may possible that user is not going to change anything in form and after adding supporting document, he is juct close the pop up
      this.AttachSupportingDoc();

    }
    //this.GetSupportingDocuments();
    this.SupportingDocGrid.refresh();
  }

  AttachSupportingDoc() {
    let SupportingDocComments = this.SupportingDocComments.value;
    var SupportingDocuments = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
    sessionStorage.removeItem("supportingDocumentList");
    //Prepare the Supporting doc Model if SupportingDocuments is not null. This might possible when user attach a document and delete it
    if (SupportingDocuments != null) {
      this.SupportingDocument.FileName = SupportingDocuments[0].FileName;
      this.SupportingDocument.OriginalFileName = SupportingDocuments[0].OriginalFileName;
      this.SupportingDocument.Description = "Supporting documents";
      this.SupportingDocument.FilePath = SupportingDocuments[0].TargetPath;
      this.SupportingDocument.EntityType = this.EntityType;
      this.SupportingDocument.EntityId = this.EntityId;
      this.SupportingDocument.CreatedById = this.LoggedInUserId;
      this.SupportingDocument.CreatedByRoleId = this.LoggedInRoleId;
      this.SupportingDocument.CreatedDateTime = new Date();
      this.SupportingDocument.UpdatedById = this.LoggedInUserId;
      this.SupportingDocument.UpdatedDateTime = new Date();
      this.SupportingDocument.IsDeleted = false;
      this.SupportingDocument.WFStepId = this.StepId;//temporary use
      this.SupportingDocument.Projectid = this.ProjectId;
      this.SupportingDocument.ParameterCarrier = "SupportingDocComments=" + SupportingDocComments;
      this.SupportingDocument.UpdatedByRoleId = this.LoggedInRoleId;
      this.SupportingDocument.TransactionId = this.EntityId;

      //Add Supporting doc in database with respect to Entity
      this._service.SaveSupportingDoc(this.SupportingDocument)
        .subscribe(
          data => {
            this.toasts[1].content = "Supporting document attached successfully";
            this.toastObj.show(this.toasts[1]);
            this.GetSupportingDocuments();
          }
        );
    }
  }

}

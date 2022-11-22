import { Component,ViewEncapsulation, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import {SelectedEventArgs, FileInfo, UploaderComponent} from '@syncfusion/ej2-angular-inputs';

import { environment } from '../../../../environments/environment';
import { SupportingDocument } from '../../../models/supportingDocModel';
import { ProjectService } from '../../../services/project.service';



@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FlexUploaderComponent {
  baseUrl = environment.baseUrl;
 
  @Input() TargetPath: string;
  @Input() AllowedFileTypes: string;
  @Input() Source: string;
  @Input() multiple: boolean;
  supportingDocumentList: any[] = [];
  @Output() PostUploadEvent = new EventEmitter();
  ProjectId: number;

  public path: Object = {
  
    saveUrl: this.baseUrl + '/FileUploader/Save',
    removeUrl: this.baseUrl + '/FileUploader/Remove',
    chunkSize: 2000000
  };



  constructor(private _projectService: ProjectService) { 
  }

  public dropElement: HTMLElement; 
  ngOnInit() {
    if (this.multiple == undefined || this.multiple == null) {
      this.multiple = false;
    }
    this.dropElement = document.getElementsByClassName('control_wrapper')[0] as HTMLElement;

   this.ProjectId = +sessionStorage.getItem("ProjectId");
    if (JSON.parse(sessionStorage.getItem("supportingDocumentList")) != null) {
      this.supportingDocumentList = JSON.parse(sessionStorage.getItem("supportingDocumentList"));
    }
    else {
      this.supportingDocumentList = [];
    }
    sessionStorage.removeItem("supportingDocumentList");
    
    //GetAllowedFileTypes
    if (this.AllowedFileTypes == null || this.AllowedFileTypes == undefined || this.AllowedFileTypes == "")
    {
      //Get from GProject table
      this._projectService.getFileExtensionsByProjectId(this.ProjectId)
        .subscribe(
          AllowedExtension => {
            this.AllowedFileTypes = AllowedExtension;
          }
        );
    }
  }

   
  onSuccess(args) {
    //success event is called on success  whether its uploaded or removed.
    //we need to emit the event only in case of upload
    if (args['operation'] == 'upload')
      this.PostUploadEvent.emit();
  }
  public onFileUpload: EmitType<SelectedEventArgs> = (args: any) => {
  

    let uploadedFileName = args.fileData.name;
    //uploadedFileName = uploadedFileName + " " + new Date();
    let supportingDocument = new SupportingDocument();
    supportingDocument.OriginalFileName = args.fileData.name;
    supportingDocument.FileName = uploadedFileName;
    supportingDocument.TargetPath = this.TargetPath;
   
    this.supportingDocumentList.push(supportingDocument);

    if (this.Source == "Supporting Documents") {
      sessionStorage.setItem("supportingDocumentList", JSON.stringify(this.supportingDocumentList));//When uploader is called from Supporting Document
    }
    else
    {
      sessionStorage.setItem("UploadedFile", JSON.stringify(this.supportingDocumentList));//When uploader iscalled other than supporting document,this.supportingDocumentList variable is same for both of then because need same info for both
    }
    
    // add addition data as key-value pair.
    args.customFormData = [{ 'targetPath': this.TargetPath }, { 'uploadedFileName': uploadedFileName }];
  };


  public onFileRemove: EmitType<SelectedEventArgs> = (args: any) => {
    

    let uploadedFileName = args.filesData[0].name;

    //delete from session because we dont need to attach this file with Entity
    let SupportingDataSource = JSON.parse(sessionStorage.getItem("supportingDocumentList"));

    SupportingDataSource = SupportingDataSource.filter(x => x.FileName != uploadedFileName);
    sessionStorage.setItem("supportingDocumentList", JSON.stringify(SupportingDataSource));

    // add addition data as key-value pair.
    args.customFormData = [{ 'targetPath': this.TargetPath }, { 'uploadedFileName': uploadedFileName }];
  };

  public onFileSelect(args: SelectedEventArgs): void { 
    args.cancel = true;
    //if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.upload-list-root'))) {
    //  this.parentElement = createElement('div', { className: 'upload-list-root' });
    //  this.parentElement.appendChild(createElement('ul', { className: 'ul-element' }));
    //  document.getElementById('dropArea').appendChild(this.parentElement);
    //}
    //for (let i: number = 0; i < args.filesData.length; i++) {
    //  this.formSelectedData(args.filesData[i], this);  // create the LI element for each file Data
    //}
    //this.filesDetails = this.filesDetails.concat(args.filesData);
    let proxy = this;
    let file: FileInfo = args.filesData[0].rawFile as any;
    let width: number;
    let height: number;
    let img: any = document.createElement("img");
    let reader: any = new FileReader();
    reader.onload = function (e: any) { img.src = e.target.result; };
    reader.readAsDataURL(file);
    let imgs = new Image();
    img.onload = function (): void {
      width = this.width;
      height = this.height;
      proxy.onNewImg(height, width, img, args.filesData[0])
    };
    imgs.src = img.src;
  }

  public newImage: any;
  public uploadObj: any;// = new UploaderComponent(null,null,null,null);
  // to create canvas and update our custom dimensions
  private onNewImg(height: any, width: any, img: any, file: any) {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    let ctx: any = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    let MAX_WIDTH: any = 1000;
    let MAX_HEIGHT: any = 600;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    let ctx1 = canvas.getContext("2d");
    ctx1.drawImage(img, 0, 0, width, height);
    this.newImage = canvas.toDataURL("image/png");
    let blobBin = atob(this.newImage.split(',')[1]);
    let array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    let newBlob = new Blob([new Uint8Array(array)], { type: 'image/png' });
    let newFile: any = this.createFile(newBlob, file);
    this.uploadObj.upload(newFile, true);
  }

  // To create File object to upload
  public createFile(image: any, file: any) {
    let newFile = {
      name: file.name,
      rawFile: image,
      size: image.size,
      type: file.type,
      validationMessage: '',
      statusCode: '1',
      status: 'Ready to Upload'
    }
    return newFile;
  }
  
}





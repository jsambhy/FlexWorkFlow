import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment';
import * as AWS from 'aws-sdk';
import { SupportingDocumentViewModel } from '../models/supportingDocModel';




@Injectable()
export class SupportingDocumentService {
  readonly basrUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }


  getSupportingDocByEntityType(EntityType: string, EntityId: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LSupportingDocuments/GetSupportingDocumentsByEntityType?EntityType=" + EntityType + "&EntityId=" + EntityId);
  }

  DeleteSupportingDocById(Id: number, EntityType: string, EntityId: number, LoggedInUserId: number, LoggedInRoleId: number): Observable<string> {
    return this.httpClient.delete<string>(this.basrUrl + "/LSupportingDocuments/DeleteSupportingDocById?Id=" + Id + "&EntityType=" + EntityType + "&EntityId=" + EntityId + "&LoggedInUserId=" + LoggedInUserId + "&LoggedInRoleId=" + LoggedInRoleId);
  }

  getSupportingDocById(Id: number): Observable<any> {
    return this.httpClient.get(this.basrUrl + "/LSupportingDocuments/GetLSupportingDocumentById?id=" + Id);
  }

  SaveSupportingDoc(model: SupportingDocumentViewModel): Observable<void> {
    return this.httpClient.post<void>(this.basrUrl + "/LSupportingDocuments/Post", model, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
  }


  //DownloadFromS3(FilePath, FileName) {
  DownloadFromS3(CompleteFilePath) {
    
    let FilePathArray = CompleteFilePath.split('/');
    let FileName = FilePathArray[FilePathArray.length - 1];
    // Set up credentials
    let AWSS3AccessKey = environment.AWSS3AccessKey
    let AWSS3SecretKey = environment.AWSS3SecretKey
    let S3Bucketname = environment.S3Bucketname
    let S3BucketRootFolder = environment.S3BucketRootFolder

    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: AWSS3AccessKey, secretAccessKey: AWSS3SecretKey
    });

    const params = {
      Bucket: S3Bucketname,
      Key: S3BucketRootFolder  + CompleteFilePath
      //Key: S3BucketRootFolder + FilePath + "/" + FileName
    };

    let s3 = new AWS.S3();

    s3.getObject(params, function (err, data) {
      if (err) {
        console.error(err); // an error occurred
      }
      else {
        //downloading the file inclient machine
        let blob: any = new Blob([data.Body as BlobPart], { type: data.ContentType });
        const url = window.URL.createObjectURL(blob);

        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = url;

        // it forces the name of the downloaded file
        fileLink.download = FileName;

        // triggers the click event
        fileLink.click();
       // window.open(url);

      }
    });

  }

}

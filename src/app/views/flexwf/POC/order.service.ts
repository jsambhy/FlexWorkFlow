import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import {
  DataStateChangeEventArgs,
  Sorts,
  DataResult
} from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Predicate } from "@syncfusion/ej2-data";

@Injectable()
export class OrdersService extends Subject<DataStateChangeEventArgs>{
  //private BASE_URL =
    //"https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders";

  //constructor(private http: Http) {
  //  super();
  //}

  //public execute(state: any) {
  //  this.getData(state).subscribe(x => super.next(x));
  //}

  //public getData(
  //  state: DataStateChangeEventArgs
  //): Observable<DataStateChangeEventArgs> {
  //  let pageQuery = "";
  //  let filterQuery = "";
  //  if (state.take === undefined) {
  //    pageQuery = "";
  //  } else {
  //    pageQuery = `$skip=${state.skip}&$top=${state.take}`;
  //  } // handled the page query
  //  let sortQuery = "";

  //  if ((state.sorted || []).length) {
  //    sortQuery =
  //      `&$orderby=` +
  //      state.sorted
  //        .map((obj: Sorts) => {
  //          return obj.direction === "descending"
  //            ? `${obj.name} desc`
  //            : obj.name;
  //        })
  //        .reverse()
  //        .join(",");
  //  }
  //  // handle the filterQuery
  //  //if (state.where) {
  //  //  filterQuery =
  //  //    `&$filter=` +
  //  //  state.where.map(obj => {
  //  //    return obj.predicate
  //  //        .map(predicate => {
  //  //          return predicate.operator === "equal"
  //  //            ? `${predicate.field} eq ${predicate.value}`
  //  //            : `${predicate.operator}(tolower(${predicate.field}),'${predicate.value
  //  //            }')`;
  //  //        })
  //  //        .reverse()
  //  //        .join(" and ");
  //  //    });
  //  //}

  //  return this.http
  //    .get(
  //      `${this.BASE_URL
  //      }?${pageQuery}${filterQuery}${sortQuery}&$inlinecount=allpages&$format=json`
  //    )
  //    .pipe(map((response: any) => response.json()))
  //    .pipe(
  //      map(
  //        (response: any) =>
  //          <DataResult>{
  //            result: response["d"]["results"],
  //            count: parseInt(response["d"]["__count"], 10)
  //          }
  //      )
  //    )
  //    .pipe((data: any) => data);
  //}
}

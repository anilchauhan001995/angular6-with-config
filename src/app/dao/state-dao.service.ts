import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendAppSettings } from '../backend.settings';
import { Observable, BehaviorSubject } from 'rxjs';
import { IStateResponse } from '../model/state.model';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, SortDescriptor } from '@progress/kendo-data-query';
import {map, retry, finalize, take} from 'rxjs/operators';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class StateDaoService extends BehaviorSubject<GridDataResult> {

  totalSearchCount = 0;
  loading: boolean;

  constructor(private http: HttpClient) { 
    super(null);
  }

  getAllStates(pageSize = 10, currentPage = 0, sort: SortDescriptor[] = []): Observable<IStateResponse> {
    const url = BackendAppSettings.endpoint.getAllStates.getUrl(pageSize, currentPage);
    return this.http.get<IStateResponse>(url).pipe(map((res: IStateResponse) => ({
      ...res,
      content: (res && res.content) || []
    })));
  }

query(state: State,successCallback?: Function,errorCallback?: Function,finalizeCallback?: Function): void {
  
  this.fetch(state)
  .pipe(finalize(() => {
    if (finalizeCallback) {
      finalizeCallback();
    }
  }), take(1))
  .subscribe(
    x => {
      this.totalSearchCount = x.total;
      super.next(x);
      if (successCallback) {
        successCallback(x);
      }
    }, err => {
      super.next({ data: [], total: this.totalSearchCount });
      if (errorCallback) {
        errorCallback(err);
      }
    });
}

  private fetch(state: State): Observable<GridDataResult> {
    if (this.totalSearchCount) {
      super.next({ data: [], total: this.totalSearchCount });
    }

    return this.mapOrderData(state).pipe(map(response => {
        return (<GridDataResult>{
          data: response.content,
          total: response.totalElements,
        });
    }), finalize(() => this.loading = false));

  }

  mapOrderData(state: State): Observable<IStateResponse> {
    return this.getAllStates(state.take, (state.skip / state.take), state.sort).pipe(map(
      (response: IStateResponse) => {
        response.content = response.content.map(value => value);
        return response;
      },
    ));
  }

}

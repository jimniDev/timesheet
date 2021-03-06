import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

type EntityResponseType = HttpResponse<IWorkingEntryTimesheet>;
type EntityArrayResponseType = HttpResponse<IWorkingEntryTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class WorkingEntryTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/working-entries';

  constructor(protected http: HttpClient) {}

  create(workingEntry: IWorkingEntryTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workingEntry);
    return this.http
      .post<IWorkingEntryTimesheet>(SERVER_API_URL + 'api/employees/me/working-entries', copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(workingEntry: IWorkingEntryTimesheet): Observable<EntityResponseType> {
    workingEntry.workDay.employee = null;
    const copy = this.convertDateFromClient(workingEntry);
    return this.http
      .put<IWorkingEntryTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWorkingEntryTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWorkingEntryTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  // timetable(req?: any): Observable<EntityArrayResponseType> {
  //   const options = createRequestOption(req);
  //   return this.http
  //     .get<IWorkingEntryTimesheet[]>(SERVER_API_URL + 'api/employees/me/working-entries', { params: options, observe: 'response' })
  //     .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  // }

  timetable(year: number, month: number): Observable<EntityArrayResponseType> {
    return this.http
      .get<IWorkingEntryTimesheet[]>(SERVER_API_URL + `api/employees/me/working-entries/year/${year}/month/${month}`, {
        observe: 'response'
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  start(): Observable<EntityResponseType> {
    return this.http
      .get<IWorkingEntryTimesheet>(this.resourceUrl + '/me/start', { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  end(): Observable<EntityResponseType> {
    return this.http
      .get<IWorkingEntryTimesheet>(this.resourceUrl + '/me/stop', { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  active(): Observable<EntityResponseType> {
    return this.http
      .get<IWorkingEntryTimesheet>(this.resourceUrl + '/me/active', { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(workingEntry: IWorkingEntryTimesheet): IWorkingEntryTimesheet {
    const copy: IWorkingEntryTimesheet = Object.assign({}, workingEntry, {
      start: workingEntry.start != null && workingEntry.start.isValid() ? workingEntry.start.toJSON() : null,
      end: workingEntry.end != null && workingEntry.end.isValid() ? workingEntry.end.toJSON() : null,
      createdAt: workingEntry.createdAt != null && workingEntry.createdAt.isValid() ? workingEntry.createdAt.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.start = res.body.start != null ? moment(res.body.start) : null;
      res.body.end = res.body.end != null ? moment(res.body.end) : null;
      res.body.createdAt = res.body.createdAt != null ? moment(res.body.createdAt) : null;
      res.body.workDay.date = res.body.workDay.date != null ? moment(res.body.workDay.date) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((workingEntry: IWorkingEntryTimesheet) => {
        workingEntry.start = workingEntry.start != null ? moment(workingEntry.start) : null;
        workingEntry.end = workingEntry.end != null ? moment(workingEntry.end) : null;
        workingEntry.createdAt = workingEntry.createdAt != null ? moment(workingEntry.createdAt) : null;
        workingEntry.workDay.date = workingEntry.workDay.date != null ? moment(workingEntry.workDay.date) : null;
      });
    }
    return res;
  }
}

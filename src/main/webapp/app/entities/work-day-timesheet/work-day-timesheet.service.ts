import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

type EntityResponseType = HttpResponse<IWorkDayTimesheet>;
type EntityArrayResponseType = HttpResponse<IWorkDayTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class WorkDayTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/work-days';

  constructor(protected http: HttpClient) {}

  create(workDay: IWorkDayTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workDay);
    return this.http
      .post<IWorkDayTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(workDay: IWorkDayTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(workDay);
    return this.http
      .put<IWorkDayTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWorkDayTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWorkDayTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBreakMinutes(id: number): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(`${this.resourceUrl}/${id}/break-minutes`, { observe: 'response' });
  }

  getAdditionalBreakMinutesbyDate(year: number, month: number, day: number): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(
      SERVER_API_URL + `api/employees/me/work-days/additional-break-minutes/year/${year}/month/${month}/day/${day}`,
      {
        observe: 'response'
      }
    );
  }

  getTotalBreakMinutesbyDate(year: number, month: number, day: number): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(SERVER_API_URL + `api/employees/me/work-days/total-break-minutes/year/${year}/month/${month}/day/${day}`, {
      observe: 'response'
    });
  }

  getTotalWorkingMinutesbyDate(year: number, month: number, day: number): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(
      SERVER_API_URL + `api/employees/me/work-days/total-working-minutes/year/${year}/month/${month}/day/${day}`,
      {
        observe: 'response'
      }
    );
  }

  protected convertDateFromClient(workDay: IWorkDayTimesheet): IWorkDayTimesheet {
    const copy: IWorkDayTimesheet = Object.assign({}, workDay, {
      date: workDay.date != null && workDay.date.isValid() ? workDay.date.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date != null ? moment(res.body.date) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((workDay: IWorkDayTimesheet) => {
        workDay.date = workDay.date != null ? moment(workDay.date) : null;
      });
    }
    return res;
  }
}

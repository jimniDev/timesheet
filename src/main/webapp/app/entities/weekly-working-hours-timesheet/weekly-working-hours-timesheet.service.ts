import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

type EntityResponseType = HttpResponse<IWeeklyWorkingHoursTimesheet>;
type EntityArrayResponseType = HttpResponse<IWeeklyWorkingHoursTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class WeeklyWorkingHoursTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/weekly-working-hours';

  constructor(protected http: HttpClient) {}

  create(weeklyWorkingHours: IWeeklyWorkingHoursTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weeklyWorkingHours);
    return this.http
      .post<IWeeklyWorkingHoursTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(weeklyWorkingHours: IWeeklyWorkingHoursTimesheet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weeklyWorkingHours);
    return this.http
      .put<IWeeklyWorkingHoursTimesheet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IWeeklyWorkingHoursTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWeeklyWorkingHoursTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(weeklyWorkingHours: IWeeklyWorkingHoursTimesheet): IWeeklyWorkingHoursTimesheet {
    const copy: IWeeklyWorkingHoursTimesheet = Object.assign({}, weeklyWorkingHours, {
      startDate:
        weeklyWorkingHours.startDate != null && weeklyWorkingHours.startDate.isValid() ? weeklyWorkingHours.startDate.toJSON() : null,
      endDate: weeklyWorkingHours.endDate != null && weeklyWorkingHours.endDate.isValid() ? weeklyWorkingHours.endDate.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate != null ? moment(res.body.startDate) : null;
      res.body.endDate = res.body.endDate != null ? moment(res.body.endDate) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((weeklyWorkingHours: IWeeklyWorkingHoursTimesheet) => {
        weeklyWorkingHours.startDate = weeklyWorkingHours.startDate != null ? moment(weeklyWorkingHours.startDate) : null;
        weeklyWorkingHours.endDate = weeklyWorkingHours.endDate != null ? moment(weeklyWorkingHours.endDate) : null;
      });
    }
    return res;
  }
}

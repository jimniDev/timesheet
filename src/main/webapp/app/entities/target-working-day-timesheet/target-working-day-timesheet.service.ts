import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

type EntityResponseType = HttpResponse<ITargetWorkingDayTimesheet>;
type EntityArrayResponseType = HttpResponse<ITargetWorkingDayTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class TargetWorkingDayTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/target-working-days';

  constructor(protected http: HttpClient) {}

  create(targetWorkingDay: ITargetWorkingDayTimesheet): Observable<EntityResponseType> {
    return this.http.post<ITargetWorkingDayTimesheet>(this.resourceUrl, targetWorkingDay, { observe: 'response' });
  }

  update(targetWorkingDay: ITargetWorkingDayTimesheet): Observable<EntityResponseType> {
    return this.http.put<ITargetWorkingDayTimesheet>(this.resourceUrl, targetWorkingDay, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITargetWorkingDayTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITargetWorkingDayTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

type EntityResponseType = HttpResponse<IDayOfWeekTimesheet>;
type EntityArrayResponseType = HttpResponse<IDayOfWeekTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class DayOfWeekTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/day-of-weeks';

  constructor(protected http: HttpClient) {}

  create(dayOfWeek: IDayOfWeekTimesheet): Observable<EntityResponseType> {
    return this.http.post<IDayOfWeekTimesheet>(this.resourceUrl, dayOfWeek, { observe: 'response' });
  }

  update(dayOfWeek: IDayOfWeekTimesheet): Observable<EntityResponseType> {
    return this.http.put<IDayOfWeekTimesheet>(this.resourceUrl, dayOfWeek, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDayOfWeekTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDayOfWeekTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

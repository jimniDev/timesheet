import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';

type EntityResponseType = HttpResponse<IDayTimesheet>;
type EntityArrayResponseType = HttpResponse<IDayTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class DayTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/days';

  constructor(protected http: HttpClient) {}

  create(day: IDayTimesheet): Observable<EntityResponseType> {
    return this.http.post<IDayTimesheet>(this.resourceUrl, day, { observe: 'response' });
  }

  update(day: IDayTimesheet): Observable<EntityResponseType> {
    return this.http.put<IDayTimesheet>(this.resourceUrl, day, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDayTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDayTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

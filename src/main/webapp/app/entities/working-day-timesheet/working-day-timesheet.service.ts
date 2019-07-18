import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

type EntityResponseType = HttpResponse<IWorkingDayTimesheet>;
type EntityArrayResponseType = HttpResponse<IWorkingDayTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class WorkingDayTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/working-days';

  constructor(protected http: HttpClient) {}

  create(workingDay: IWorkingDayTimesheet): Observable<EntityResponseType> {
    return this.http.post<IWorkingDayTimesheet>(this.resourceUrl, workingDay, { observe: 'response' });
  }

  update(workingDay: IWorkingDayTimesheet): Observable<EntityResponseType> {
    return this.http.put<IWorkingDayTimesheet>(this.resourceUrl, workingDay, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkingDayTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkingDayTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

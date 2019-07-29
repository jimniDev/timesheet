import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

type EntityResponseType = HttpResponse<IWorkBreakTimesheet>;
type EntityArrayResponseType = HttpResponse<IWorkBreakTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class WorkBreakTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/work-breaks';

  constructor(protected http: HttpClient) {}

  create(workBreak: IWorkBreakTimesheet): Observable<EntityResponseType> {
    return this.http.post<IWorkBreakTimesheet>(this.resourceUrl, workBreak, { observe: 'response' });
  }

  update(workBreak: IWorkBreakTimesheet): Observable<EntityResponseType> {
    return this.http.put<IWorkBreakTimesheet>(this.resourceUrl, workBreak, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkBreakTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkBreakTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

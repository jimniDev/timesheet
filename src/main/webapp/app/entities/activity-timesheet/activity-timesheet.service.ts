import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

type EntityResponseType = HttpResponse<IActivityTimesheet>;
type EntityArrayResponseType = HttpResponse<IActivityTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class ActivityTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/activities';

  constructor(protected http: HttpClient) {}

  create(activity: IActivityTimesheet): Observable<EntityResponseType> {
    return this.http.post<IActivityTimesheet>(this.resourceUrl, activity, { observe: 'response' });
  }

  update(activity: IActivityTimesheet): Observable<EntityResponseType> {
    return this.http.put<IActivityTimesheet>(this.resourceUrl, activity, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

type EntityResponseType = HttpResponse<ILocationTimesheet>;
type EntityArrayResponseType = HttpResponse<ILocationTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class LocationTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/locations';

  constructor(protected http: HttpClient) {}

  create(location: ILocationTimesheet): Observable<EntityResponseType> {
    return this.http.post<ILocationTimesheet>(this.resourceUrl, location, { observe: 'response' });
  }

  update(location: ILocationTimesheet): Observable<EntityResponseType> {
    return this.http.put<ILocationTimesheet>(this.resourceUrl, location, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILocationTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocationTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

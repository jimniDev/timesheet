import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

type EntityResponseType = HttpResponse<IRoleTimesheet>;
type EntityArrayResponseType = HttpResponse<IRoleTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class RoleTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/roles';

  constructor(protected http: HttpClient) {}

  create(role: IRoleTimesheet): Observable<EntityResponseType> {
    return this.http.post<IRoleTimesheet>(this.resourceUrl, role, { observe: 'response' });
  }

  update(role: IRoleTimesheet): Observable<EntityResponseType> {
    return this.http.put<IRoleTimesheet>(this.resourceUrl, role, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRoleTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoleTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

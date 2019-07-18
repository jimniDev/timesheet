import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';

type EntityResponseType = HttpResponse<ICountryTimesheet>;
type EntityArrayResponseType = HttpResponse<ICountryTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class CountryTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/countries';

  constructor(protected http: HttpClient) {}

  create(country: ICountryTimesheet): Observable<EntityResponseType> {
    return this.http.post<ICountryTimesheet>(this.resourceUrl, country, { observe: 'response' });
  }

  update(country: ICountryTimesheet): Observable<EntityResponseType> {
    return this.http.put<ICountryTimesheet>(this.resourceUrl, country, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICountryTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICountryTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

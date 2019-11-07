import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

type EntityResponseType = HttpResponse<IEmployeeTimesheet>;
type EntityArrayResponseType = HttpResponse<IEmployeeTimesheet[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeTimesheetService {
  public resourceUrl = SERVER_API_URL + 'api/employees';

  constructor(protected http: HttpClient) {}

  create(employee: IEmployeeTimesheet): Observable<EntityResponseType> {
    return this.http.post<IEmployeeTimesheet>(this.resourceUrl, employee, { observe: 'response' });
  }

  update(employee: IEmployeeTimesheet): Observable<EntityResponseType> {
    return this.http.put<IEmployeeTimesheet>(this.resourceUrl, employee, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmployeeTimesheet>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployeeTimesheet[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  all(): Observable<EntityArrayResponseType> {
    return this.http.get<IEmployeeTimesheet[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  targetWorkTime(year: number, month: number) {
    return this.http.get<number>(this.resourceUrl + '/me/target-work-time/' + year + '/' + month, { observe: 'response' });
  }

  actualWorkTime(year: number, month: number) {
    return this.http.get<number>(this.resourceUrl + '/me/work-time/' + year + '/' + month, { observe: 'response' });
  }

  targetWorkTimMinutes(year: number, month: number, day: number) {
    return this.http.get<number>(this.resourceUrl + '/me/target-work-time/' + year + '/' + month + '/' + day, { observe: 'response' });
  }

  weeklyTargetWorkTime(year: number, week: number) {
    return this.http.get<number>(this.resourceUrl + '/me/target-work-time/' + year + '/iso-week/' + week, { observe: 'response' });
  }

  weeklyActualWorkTime(year: number, week: number) {
    return this.http.get<number>(this.resourceUrl + '/me/work-time/' + year + '/iso-week/' + week, { observe: 'response' });
  }

  balanceByEmployee(employeeId: number) {
    return this.http.get<number>(`${this.resourceUrl}/${employeeId}/work-time/balance`, { observe: 'response' });
  }

  currentWorkTimeBalance() {
    return this.http.get<number>(this.resourceUrl + '/me/work-time/balance', { observe: 'response' });
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IWeeklyWorkingHoursTimesheet, WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { WeeklyWorkingHoursTimesheetService } from './weekly-working-hours-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';

@Component({
  selector: 'jhi-weekly-working-hours-timesheet-update',
  templateUrl: './weekly-working-hours-timesheet-update.component.html'
})
export class WeeklyWorkingHoursTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  editForm = this.fb.group({
    id: [],
    hours: [],
    startDate: [],
    endDate: [],
    employee: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ weeklyWorkingHours }) => {
      this.updateForm(weeklyWorkingHours);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(weeklyWorkingHours: IWeeklyWorkingHoursTimesheet) {
    this.editForm.patchValue({
      id: weeklyWorkingHours.id,
      hours: weeklyWorkingHours.hours,
      startDate: weeklyWorkingHours.startDate != null ? weeklyWorkingHours.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: weeklyWorkingHours.endDate != null ? weeklyWorkingHours.endDate.format(DATE_TIME_FORMAT) : null,
      employee: weeklyWorkingHours.employee
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const weeklyWorkingHours = this.createFromForm();
    if (weeklyWorkingHours.id !== undefined) {
      this.subscribeToSaveResponse(this.weeklyWorkingHoursService.update(weeklyWorkingHours));
    } else {
      this.subscribeToSaveResponse(this.weeklyWorkingHoursService.create(weeklyWorkingHours));
    }
  }

  private createFromForm(): IWeeklyWorkingHoursTimesheet {
    return {
      ...new WeeklyWorkingHoursTimesheet(),
      id: this.editForm.get(['id']).value,
      hours: this.editForm.get(['hours']).value,
      startDate:
        this.editForm.get(['startDate']).value != null ? moment(this.editForm.get(['startDate']).value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate']).value != null ? moment(this.editForm.get(['endDate']).value, DATE_TIME_FORMAT) : undefined,
      employee: this.editForm.get(['employee']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeeklyWorkingHoursTimesheet>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackEmployeeById(index: number, item: IEmployeeTimesheet) {
    return item.id;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IWorkingDayTimesheet, WorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';
import { WorkingDayTimesheetService } from './working-day-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';
import { DayTimesheetService } from 'app/entities/day-timesheet';

@Component({
  selector: 'jhi-working-day-timesheet-update',
  templateUrl: './working-day-timesheet-update.component.html'
})
export class WorkingDayTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  days: IDayTimesheet[];

  editForm = this.fb.group({
    id: [],
    hours: [],
    employee: [],
    day: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected workingDayService: WorkingDayTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected dayService: DayTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ workingDay }) => {
      this.updateForm(workingDay);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.dayService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDayTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDayTimesheet[]>) => response.body)
      )
      .subscribe((res: IDayTimesheet[]) => (this.days = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(workingDay: IWorkingDayTimesheet) {
    this.editForm.patchValue({
      id: workingDay.id,
      hours: workingDay.hours,
      employee: workingDay.employee,
      day: workingDay.day
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const workingDay = this.createFromForm();
    if (workingDay.id !== undefined) {
      this.subscribeToSaveResponse(this.workingDayService.update(workingDay));
    } else {
      this.subscribeToSaveResponse(this.workingDayService.create(workingDay));
    }
  }

  private createFromForm(): IWorkingDayTimesheet {
    return {
      ...new WorkingDayTimesheet(),
      id: this.editForm.get(['id']).value,
      hours: this.editForm.get(['hours']).value,
      employee: this.editForm.get(['employee']).value,
      day: this.editForm.get(['day']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkingDayTimesheet>>) {
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

  trackDayById(index: number, item: IDayTimesheet) {
    return item.id;
  }
}

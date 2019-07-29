import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITargetWorkingDayTimesheet, TargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';
import { TargetWorkingDayTimesheetService } from './target-working-day-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';
import { DayOfWeekTimesheetService } from 'app/entities/day-of-week-timesheet';

@Component({
  selector: 'jhi-target-working-day-timesheet-update',
  templateUrl: './target-working-day-timesheet-update.component.html'
})
export class TargetWorkingDayTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  dayofweeks: IDayOfWeekTimesheet[];

  editForm = this.fb.group({
    id: [],
    hours: [null, [Validators.required]],
    employee: [],
    dayOfWeek: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected targetWorkingDayService: TargetWorkingDayTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected dayOfWeekService: DayOfWeekTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ targetWorkingDay }) => {
      this.updateForm(targetWorkingDay);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.dayOfWeekService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDayOfWeekTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDayOfWeekTimesheet[]>) => response.body)
      )
      .subscribe((res: IDayOfWeekTimesheet[]) => (this.dayofweeks = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(targetWorkingDay: ITargetWorkingDayTimesheet) {
    this.editForm.patchValue({
      id: targetWorkingDay.id,
      hours: targetWorkingDay.hours,
      employee: targetWorkingDay.employee,
      dayOfWeek: targetWorkingDay.dayOfWeek
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const targetWorkingDay = this.createFromForm();
    if (targetWorkingDay.id !== undefined) {
      this.subscribeToSaveResponse(this.targetWorkingDayService.update(targetWorkingDay));
    } else {
      this.subscribeToSaveResponse(this.targetWorkingDayService.create(targetWorkingDay));
    }
  }

  private createFromForm(): ITargetWorkingDayTimesheet {
    return {
      ...new TargetWorkingDayTimesheet(),
      id: this.editForm.get(['id']).value,
      hours: this.editForm.get(['hours']).value,
      employee: this.editForm.get(['employee']).value,
      dayOfWeek: this.editForm.get(['dayOfWeek']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITargetWorkingDayTimesheet>>) {
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

  trackDayOfWeekById(index: number, item: IDayOfWeekTimesheet) {
    return item.id;
  }
}

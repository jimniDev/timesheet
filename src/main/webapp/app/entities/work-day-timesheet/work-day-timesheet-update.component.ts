import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IWorkDayTimesheet, WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { WorkDayTimesheetService } from './work-day-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';

@Component({
  selector: 'jhi-work-day-timesheet-update',
  templateUrl: './work-day-timesheet-update.component.html'
})
export class WorkDayTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    employee: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected workDayService: WorkDayTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ workDay }) => {
      this.updateForm(workDay);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(workDay: IWorkDayTimesheet) {
    this.editForm.patchValue({
      id: workDay.id,
      date: workDay.date != null ? workDay.date.format(DATE_TIME_FORMAT) : null,
      employee: workDay.employee
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const workDay = this.createFromForm();
    if (workDay.id !== undefined) {
      this.subscribeToSaveResponse(this.workDayService.update(workDay));
    } else {
      this.subscribeToSaveResponse(this.workDayService.create(workDay));
    }
  }

  private createFromForm(): IWorkDayTimesheet {
    return {
      ...new WorkDayTimesheet(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value != null ? moment(this.editForm.get(['date']).value, DATE_TIME_FORMAT) : undefined,
      employee: this.editForm.get(['employee']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkDayTimesheet>>) {
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

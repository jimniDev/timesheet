import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IWorkBreakTimesheet, WorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';
import { WorkBreakTimesheetService } from './work-break-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet';

@Component({
  selector: 'jhi-work-break-timesheet-update',
  templateUrl: './work-break-timesheet-update.component.html'
})
export class WorkBreakTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  workdays: IWorkDayTimesheet[];

  editForm = this.fb.group({
    id: [],
    minutes: [null, [Validators.required]],
    employee: [],
    workDay: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected workBreakService: WorkBreakTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected workDayService: WorkDayTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ workBreak }) => {
      this.updateForm(workBreak);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.workDayService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IWorkDayTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IWorkDayTimesheet[]>) => response.body)
      )
      .subscribe((res: IWorkDayTimesheet[]) => (this.workdays = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(workBreak: IWorkBreakTimesheet) {
    this.editForm.patchValue({
      id: workBreak.id,
      minutes: workBreak.minutes,
      employee: workBreak.employee,
      workDay: workBreak.workDay
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const workBreak = this.createFromForm();
    if (workBreak.id !== undefined) {
      this.subscribeToSaveResponse(this.workBreakService.update(workBreak));
    } else {
      this.subscribeToSaveResponse(this.workBreakService.create(workBreak));
    }
  }

  private createFromForm(): IWorkBreakTimesheet {
    return {
      ...new WorkBreakTimesheet(),
      id: this.editForm.get(['id']).value,
      minutes: this.editForm.get(['minutes']).value,
      employee: this.editForm.get(['employee']).value,
      workDay: this.editForm.get(['workDay']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkBreakTimesheet>>) {
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

  trackWorkDayById(index: number, item: IWorkDayTimesheet) {
    return item.id;
  }
}

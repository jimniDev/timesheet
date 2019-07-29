import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { WorkingEntryTimesheetService } from './working-entry-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet';
import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { LocationTimesheetService } from 'app/entities/location-timesheet';

@Component({
  selector: 'jhi-working-entry-timesheet-update',
  templateUrl: './working-entry-timesheet-update.component.html'
})
export class WorkingEntryTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  employees: IEmployeeTimesheet[];

  activities: IActivityTimesheet[];

  workdays: IWorkDayTimesheet[];

  locations: ILocationTimesheet[];

  editForm = this.fb.group({
    id: [],
    start: [null, [Validators.required]],
    end: [null, [Validators.required]],
    deleteFlag: [],
    lockedFlag: [],
    createdAt: [null, [Validators.required]],
    employee: [],
    activity: [],
    workDay: [],
    location: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected workingEntryService: WorkingEntryTimesheetService,
    protected employeeService: EmployeeTimesheetService,
    protected activityService: ActivityTimesheetService,
    protected workDayService: WorkDayTimesheetService,
    protected locationService: LocationTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ workingEntry }) => {
      this.updateForm(workingEntry);
    });
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeTimesheet[]>) => response.body)
      )
      .subscribe((res: IEmployeeTimesheet[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.activityService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IActivityTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IActivityTimesheet[]>) => response.body)
      )
      .subscribe((res: IActivityTimesheet[]) => (this.activities = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.workDayService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IWorkDayTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IWorkDayTimesheet[]>) => response.body)
      )
      .subscribe((res: IWorkDayTimesheet[]) => (this.workdays = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.locationService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ILocationTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<ILocationTimesheet[]>) => response.body)
      )
      .subscribe((res: ILocationTimesheet[]) => (this.locations = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(workingEntry: IWorkingEntryTimesheet) {
    this.editForm.patchValue({
      id: workingEntry.id,
      start: workingEntry.start != null ? workingEntry.start.format(DATE_TIME_FORMAT) : null,
      end: workingEntry.end != null ? workingEntry.end.format(DATE_TIME_FORMAT) : null,
      deleteFlag: workingEntry.deleteFlag,
      lockedFlag: workingEntry.lockedFlag,
      createdAt: workingEntry.createdAt != null ? workingEntry.createdAt.format(DATE_TIME_FORMAT) : null,
      employee: workingEntry.employee,
      activity: workingEntry.activity,
      workDay: workingEntry.workDay,
      location: workingEntry.location
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const workingEntry = this.createFromForm();
    if (workingEntry.id !== undefined) {
      this.subscribeToSaveResponse(this.workingEntryService.update(workingEntry));
    } else {
      this.subscribeToSaveResponse(this.workingEntryService.create(workingEntry));
    }
  }

  private createFromForm(): IWorkingEntryTimesheet {
    return {
      ...new WorkingEntryTimesheet(),
      id: this.editForm.get(['id']).value,
      start: this.editForm.get(['start']).value != null ? moment(this.editForm.get(['start']).value, DATE_TIME_FORMAT) : undefined,
      end: this.editForm.get(['end']).value != null ? moment(this.editForm.get(['end']).value, DATE_TIME_FORMAT) : undefined,
      deleteFlag: this.editForm.get(['deleteFlag']).value,
      lockedFlag: this.editForm.get(['lockedFlag']).value,
      createdAt:
        this.editForm.get(['createdAt']).value != null ? moment(this.editForm.get(['createdAt']).value, DATE_TIME_FORMAT) : undefined,
      employee: this.editForm.get(['employee']).value,
      activity: this.editForm.get(['activity']).value,
      workDay: this.editForm.get(['workDay']).value,
      location: this.editForm.get(['location']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWorkingEntryTimesheet>>) {
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

  trackActivityById(index: number, item: IActivityTimesheet) {
    return item.id;
  }

  trackWorkDayById(index: number, item: IWorkDayTimesheet) {
    return item.id;
  }

  trackLocationById(index: number, item: ILocationTimesheet) {
    return item.id;
  }
}

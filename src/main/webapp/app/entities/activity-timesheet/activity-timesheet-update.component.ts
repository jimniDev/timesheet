import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IActivityTimesheet, ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from './activity-timesheet.service';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from 'app/entities/role-timesheet';

@Component({
  selector: 'jhi-activity-timesheet-update',
  templateUrl: './activity-timesheet-update.component.html'
})
export class ActivityTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  roles: IRoleTimesheet[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected activityService: ActivityTimesheetService,
    protected roleService: RoleTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.updateForm(activity);
    });
    this.roleService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRoleTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRoleTimesheet[]>) => response.body)
      )
      .subscribe((res: IRoleTimesheet[]) => (this.roles = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(activity: IActivityTimesheet) {
    this.editForm.patchValue({
      id: activity.id,
      name: activity.name,
      description: activity.description
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const activity = this.createFromForm();
    if (activity.id !== undefined) {
      this.subscribeToSaveResponse(this.activityService.update(activity));
    } else {
      this.subscribeToSaveResponse(this.activityService.create(activity));
    }
  }

  private createFromForm(): IActivityTimesheet {
    return {
      ...new ActivityTimesheet(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityTimesheet>>) {
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

  trackRoleById(index: number, item: IRoleTimesheet) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

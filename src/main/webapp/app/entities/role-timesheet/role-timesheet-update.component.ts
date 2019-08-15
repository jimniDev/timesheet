import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IRoleTimesheet, RoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from './role-timesheet.service';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';

@Component({
  selector: 'jhi-role-timesheet-update',
  templateUrl: './role-timesheet-update.component.html'
})
export class RoleTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  activities: IActivityTimesheet[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    activities: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected roleService: RoleTimesheetService,
    protected activityService: ActivityTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ role }) => {
      this.updateForm(role);
    });
    this.activityService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IActivityTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<IActivityTimesheet[]>) => response.body)
      )
      .subscribe((res: IActivityTimesheet[]) => (this.activities = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(role: IRoleTimesheet) {
    this.editForm.patchValue({
      id: role.id,
      name: role.name,
      description: role.description,
      activities: role.activities
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const role = this.createFromForm();
    if (role.id !== undefined) {
      this.subscribeToSaveResponse(this.roleService.update(role));
    } else {
      this.subscribeToSaveResponse(this.roleService.create(role));
    }
  }

  private createFromForm(): IRoleTimesheet {
    return {
      ...new RoleTimesheet(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value,
      activities: this.editForm.get(['activities']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoleTimesheet>>) {
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

  trackActivityById(index: number, item: IActivityTimesheet) {
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

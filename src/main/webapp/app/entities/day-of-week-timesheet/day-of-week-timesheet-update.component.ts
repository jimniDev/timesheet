import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDayOfWeekTimesheet, DayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';
import { DayOfWeekTimesheetService } from './day-of-week-timesheet.service';

@Component({
  selector: 'jhi-day-of-week-timesheet-update',
  templateUrl: './day-of-week-timesheet-update.component.html'
})
export class DayOfWeekTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]]
  });

  constructor(protected dayOfWeekService: DayOfWeekTimesheetService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ dayOfWeek }) => {
      this.updateForm(dayOfWeek);
    });
  }

  updateForm(dayOfWeek: IDayOfWeekTimesheet) {
    this.editForm.patchValue({
      id: dayOfWeek.id,
      name: dayOfWeek.name
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const dayOfWeek = this.createFromForm();
    if (dayOfWeek.id !== undefined) {
      this.subscribeToSaveResponse(this.dayOfWeekService.update(dayOfWeek));
    } else {
      this.subscribeToSaveResponse(this.dayOfWeekService.create(dayOfWeek));
    }
  }

  private createFromForm(): IDayOfWeekTimesheet {
    return {
      ...new DayOfWeekTimesheet(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDayOfWeekTimesheet>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}

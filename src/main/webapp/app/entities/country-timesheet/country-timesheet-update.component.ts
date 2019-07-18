import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICountryTimesheet, CountryTimesheet } from 'app/shared/model/country-timesheet.model';
import { CountryTimesheetService } from './country-timesheet.service';

@Component({
  selector: 'jhi-country-timesheet-update',
  templateUrl: './country-timesheet-update.component.html'
})
export class CountryTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    countryName: []
  });

  constructor(protected countryService: CountryTimesheetService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ country }) => {
      this.updateForm(country);
    });
  }

  updateForm(country: ICountryTimesheet) {
    this.editForm.patchValue({
      id: country.id,
      countryName: country.countryName
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const country = this.createFromForm();
    if (country.id !== undefined) {
      this.subscribeToSaveResponse(this.countryService.update(country));
    } else {
      this.subscribeToSaveResponse(this.countryService.create(country));
    }
  }

  private createFromForm(): ICountryTimesheet {
    return {
      ...new CountryTimesheet(),
      id: this.editForm.get(['id']).value,
      countryName: this.editForm.get(['countryName']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICountryTimesheet>>) {
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

import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILocationTimesheet, LocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { LocationTimesheetService } from './location-timesheet.service';
import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';
import { CountryTimesheetService } from 'app/entities/country-timesheet';

@Component({
  selector: 'jhi-location-timesheet-update',
  templateUrl: './location-timesheet-update.component.html'
})
export class LocationTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  countries: ICountryTimesheet[];

  editForm = this.fb.group({
    id: [],
    street: [],
    streetNumber: [],
    postalCode: [],
    city: [],
    country: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected locationService: LocationTimesheetService,
    protected countryService: CountryTimesheetService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);
    });
    this.countryService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICountryTimesheet[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICountryTimesheet[]>) => response.body)
      )
      .subscribe((res: ICountryTimesheet[]) => (this.countries = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(location: ILocationTimesheet) {
    this.editForm.patchValue({
      id: location.id,
      street: location.street,
      streetNumber: location.streetNumber,
      postalCode: location.postalCode,
      city: location.city,
      country: location.country
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocationTimesheet {
    return {
      ...new LocationTimesheet(),
      id: this.editForm.get(['id']).value,
      street: this.editForm.get(['street']).value,
      streetNumber: this.editForm.get(['streetNumber']).value,
      postalCode: this.editForm.get(['postalCode']).value,
      city: this.editForm.get(['city']).value,
      country: this.editForm.get(['country']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationTimesheet>>) {
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

  trackCountryById(index: number, item: ICountryTimesheet) {
    return item.id;
  }
}

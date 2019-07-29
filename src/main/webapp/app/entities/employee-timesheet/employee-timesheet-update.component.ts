import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IEmployeeTimesheet, EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from './employee-timesheet.service';

@Component({
  selector: 'jhi-employee-timesheet-update',
  templateUrl: './employee-timesheet-update.component.html'
})
export class EmployeeTimesheetUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    isEmployed: []
  });

  constructor(protected employeeService: EmployeeTimesheetService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.updateForm(employee);
    });
  }

  updateForm(employee: IEmployeeTimesheet) {
    this.editForm.patchValue({
      id: employee.id,
      isEmployed: employee.isEmployed
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employee = this.createFromForm();
    if (employee.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  private createFromForm(): IEmployeeTimesheet {
    return {
      ...new EmployeeTimesheet(),
      id: this.editForm.get(['id']).value,
      isEmployed: this.editForm.get(['isEmployed']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeTimesheet>>) {
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

import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import * as moment from 'moment';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatSnackBar } from '@angular/material';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { HomeService } from '../home.service';

export const MY_FORMAT = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY'
  }
};

@Component({
  selector: 'jhi-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMAT }, HomeService]
})
export class DateFormComponent implements OnInit {
  // roles: string[];

  @Output() newWorkingEntry = new EventEmitter<WorkingEntryTimesheet>();
  @Output() saved = new EventEmitter<boolean>();

  timeForm = new FormGroup({
    dateControl: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    endTime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    roleControl: new FormControl('', Validators.required),
    activityControl: new FormControl('', Validators.required),
    addBreakControl: new FormControl('', Validators.pattern('^[0-9]*$'))
  });

  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private workingEntryService: WorkingEntryTimesheetService,
    private activityService: ActivityTimesheetService,
    private roleService: RoleTimesheetService,
    private employeeService: EmployeeTimesheetService,
    private _snackBar: MatSnackBar,
    public homeService: HomeService
  ) {}

  ngOnInit() {
    // this.dateAdapter.setLocale('de'); // german calender
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    }; // start with monday
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
      }
    });
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.selectableActivities = this.activities;
      }
    });
    this.timeForm.get('roleControl').valueChanges.subscribe(value => {
      if (value) {
        this.selectableActivities = value.activities;
      }
    });

    this.timeForm.get('dateControl').valueChanges.subscribe(value => {
      this.fillDay();
    });

    this.timeForm.get('activityControl').valueChanges.subscribe((value: IActivityTimesheet) => {
      this.fillDay();
    });
  }

  fillBreak() {}

  fillDay() {
    const activity: IActivityTimesheet = this.timeForm.get('activityControl').value;
    const dateBefore = this.timeForm.get('dateControl').value;
    if (activity && activity.fillDay && dateBefore) {
      const date: moment.Moment = moment(dateBefore).add(2, 'hours');
      this.employeeService.targetWorkTimMinutes(date.year(), date.month() + 1, date.date()).subscribe(res => {
        if (res.ok) {
          const endTimeMoment = moment(date.format('YYYY-MM-DD') + ' 10:00').add(res.body, 'minutes');
          this.timeForm.patchValue({ startTime: '10:00', endTime: endTimeMoment.format('HH:mm') });
        }
      });
    }
  }

  selectToday() {
    this.timeForm.patchValue({ dateControl: moment() });
  }

  onSubmit() {
    const workDay: WorkDayTimesheet = new WorkDayTimesheet();
    const formDate = moment(this.timeForm.value.dateControl).add(2, 'hours');

    workDay.date = formDate;

    const startMoment = moment(formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.startTime);
    const endMoment = moment(formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.endTime);

    if (startMoment >= endMoment) {
      this._snackBar.open('End time should be after the Start time', 'close', {
        duration: 5000
      });
    } else {
      const diff = moment.duration(endMoment.diff(startMoment)).asMinutes();
      if (diff <= this.timeForm.value.addBreakControl) {
        this._snackBar.open('Break minutes cannot be over Working hours', 'Close', {
          duration: 5000
        });
      } else {
        let workingEntry: WorkingEntryTimesheet;
        workingEntry = new WorkingEntryTimesheet();
        workingEntry.start = startMoment;
        workingEntry.end = endMoment;
        workingEntry.workDay = workDay;
        workingEntry.deleted = false;
        workingEntry.activity = this.timeForm.value.activityControl;
        workingEntry.workDay.additionalBreakMinutes = Number.parseInt(this.timeForm.value.addBreakControl, 10) || 0;

        this.workingEntryService.create(workingEntry).subscribe(
          res => {
            if (res.ok) {
              this.newWorkingEntry.emit(res.body);
              this.saved.emit(true);
              // 400 else error
            }
          },
          err => {
            if (err.error.errorKey === 'overlappingtime') {
              // then show the snackbar.
              this._snackBar.open('Time Entry is overlapped', 'Close', {
                duration: 5000
              });
            }
          }
        );
      }
    }
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      // modification : blocked the period (.)
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}

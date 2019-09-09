import { Component, OnInit, ViewChild } from '@angular/core';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource, MatTable } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityEditDialogComponent } from '../activity-edit-dialog/activity-edit-dialog.component';

@Component({
  selector: 'jhi-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit {
  activities: IActivityTimesheet[];

  datasource: MatTableDataSource<IActivityTimesheet>;

  displayedColumns = ['id', 'name', 'description', 'absence', 'fillDay', 'reduce', 'edit', 'actions'];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(private activityService: ActivityTimesheetService, public dialog: MatDialog) {}

  ngOnInit() {
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.datasource = new MatTableDataSource(this.activities);
      }
    });
  }

  public addActivity(activity: IActivityTimesheet) {
    this.activities.push(activity);
    this.table.renderRows();
  }

  public deleteActivity(activity: IActivityTimesheet) {
    this.activityService.delete(activity.id).subscribe(res => {
      if (res.ok) {
        this.activities.splice(this.activities.indexOf(activity), 1);
        this.table.renderRows();
      }
    });
  }
  editActivityDialog(activity: IActivityTimesheet): void {
    const dialogRef = this.dialog.open(ActivityEditDialogComponent, {
      width: '25%',
      data: {
        name: activity.name,
        description: activity.description,
        absence: activity.absence,
        fillday: activity.fillDay,
        reduced: activity.reduce,
        activity: activity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //   this.roleTable.update(<IRoleTimesheet>result);
      }
    });
  }
}

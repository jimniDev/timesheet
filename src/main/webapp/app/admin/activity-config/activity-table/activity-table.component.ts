import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource, MatTable, MatPaginator } from '@angular/material';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityEditDialogComponent } from '../activity-edit-dialog/activity-edit-dialog.component';

@Component({
  selector: 'jhi-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit {
  [x: string]: any;
  activities: IActivityTimesheet[];
  datasource = new MatTableDataSource<IActivityTimesheet>();
  displayedColumns = ['id', 'name', 'description', 'absence', 'fillDay', 'reduce', 'actions'];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private cdr: ChangeDetectorRef, private activityService: ActivityTimesheetService, public dialog: MatDialog) {}

  ngOnInit() {
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.datasource = new MatTableDataSource(this.activities);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
      }
    });
  }

  refresh() {
    this.datasource.connect().next(this.activities);
    this.pageAndSort();
  }

  pageAndSort() {
    this.cdr.detectChanges();
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
    this.refresh();
  }
  public addActivity(activity: IActivityTimesheet) {
    this.activities.push(activity);
    this.table.renderRows();
    this.refresh();
  }

  public deleteActivity(activity: IActivityTimesheet) {
    this.activityService.delete(activity.id).subscribe(res => {
      if (res.ok) {
        this.activities.splice(this.activities.indexOf(activity), 1);
        this.table.renderRows();
        this.refresh();
      }
    });
  }

  editActivityDialog(activity: IActivityTimesheet): void {
    const dialogRef = this.dialog.open(ActivityEditDialogComponent, {
      data: {
        name: activity.name,
        description: activity.description,
        absence: activity.absence,
        fillday: activity.fillDay,
        reduce: activity.reduce,
        activity
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const idx = this.activities.findIndex(we => we.id === result.id);
        this.activities[idx] = result;
        this.refresh();
      }
    });
  }
}

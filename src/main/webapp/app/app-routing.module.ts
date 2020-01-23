import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { PersonalDetailsModule } from './personal-details/personal-details.module';

const LAYOUT_ROUTES = [...errorRoute];

@NgModule({
  imports: [
    PersonalDetailsModule,
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          loadChildren: './admin/admin.module#TimesheetAdminModule'
        },
        ...LAYOUT_ROUTES
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    )
  ],
  exports: [RouterModule]
})
export class TimesheetAppRoutingModule {}

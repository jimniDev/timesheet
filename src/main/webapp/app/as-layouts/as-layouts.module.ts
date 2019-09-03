import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsNavbarComponent } from './as-navbar/as-navbar.component';
import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatButton,
  MatTableModule
} from '@angular/material';
// import { AppRoutingModule } from '../../app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AsNavbarMessagesService } from './as-navbar/as-navbar-messages.service';
import { AsMainCardComponent } from './as-main-card/as-main-card.component';
import { AsGridComponent } from './as-grid/as-grid.component';
import { AsMainComponent } from './as-main/as-main.component';
import { MattimetableComponent } from './mattimetable/mattimetable.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [AsNavbarComponent, AsMainCardComponent, AsMainComponent, AsGridComponent, MattimetableComponent],
  imports: [
    CommonModule,
    // AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule
  ],
  exports: [
    AsNavbarComponent,
    AsMainCardComponent,
    AsGridComponent,
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatGridListModule,
    MatTableModule
  ],
  providers: [AsNavbarMessagesService]
})
export class AsLayoutsModule {
  // static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: AsLayoutsModule,
  //     providers: [ AsNavbarMessagesService ]
  //   };
  // }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfService } from './pdf.service';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AsLayoutsModule],
  providers: [PdfService],
  entryComponents: []
})
export class PdfModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGeneratorComponent } from './table-generator/table-generator.component';
import { PdfService } from './pdf.service';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';

@NgModule({
  declarations: [TableGeneratorComponent],
  imports: [CommonModule, AsLayoutsModule],
  providers: [PdfService],
  entryComponents: [TableGeneratorComponent]
})
export class PdfModule {}

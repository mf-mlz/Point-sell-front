import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from './icons.component'; 
import { IconModule } from '@coreui/icons-angular';

@NgModule({
  declarations: [IconsComponent],
  imports: [CommonModule, IconModule],
  exports: [IconsComponent],
})
export class IconsModule {}

import { Component, Input } from '@angular/core';
import { cilPencil, cilTrash, cilTouchApp, cilPlus } from '@coreui/icons';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent {
  @Input() icon: string = 'view'; 

  icons: Record<string, any> = {
    pencil: cilPencil,
    trash: cilTrash,
    view: cilTouchApp,
    plus: cilPlus,
  };

  get iconContent() {
    return this.icons[this.icon];
  }
}

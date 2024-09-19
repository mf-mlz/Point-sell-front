import { Component, Input } from '@angular/core';
import { cilPencil, cilTrash, cilTouchApp, cilPlus} from '@coreui/icons';

type IconName = 'pencil' | 'trash' | 'view' | 'plus'; 

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent {
  @Input() icon: IconName = 'view';

  icons: Record<IconName, string[]> = {
    pencil: cilPencil,
    trash: cilTrash,
    view: cilTouchApp,
    plus: cilPlus,
  };

  get iconContent() {
    return this.icons[this.icon];
  }
}

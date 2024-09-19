import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [ DatatableComponent ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent {

}

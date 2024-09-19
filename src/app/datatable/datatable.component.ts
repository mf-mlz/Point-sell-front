import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { IconDirective, IconSetService, IconModule } from '@coreui/icons-angular';
import { IconsModule } from '../icons/icons.module';

export interface PeriodicElement {
  name: string;
  age: number;
  gender: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'John', age: 25, gender: 'Male' },
  { name: 'Jane', age: 30, gender: 'Female' },
];

@Component({
  providers: [IconSetService],
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    IconDirective,
    IconModule,
    IconsModule
  ],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss', '../../scss/buttons.scss'],
})
export class DatatableComponent implements AfterViewInit {
  public icons!: [string, string[]][];
 
  displayedColumns: string[] = ['name', 'age', 'gender', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  pageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // Métodos para los botones
  viewElement(element: PeriodicElement) {
    console.log('Ver:', element);
  }

  editElement(element: PeriodicElement) {
    console.log('Editar:', element);
  }

  deleteElement(element: PeriodicElement) {
    console.log('Eliminar:', element);
  }
}

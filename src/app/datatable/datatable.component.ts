import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IconsModule } from '../icons/icons.module';
import { ButtonConfig } from '../models/interfaces';

export interface ColumnDef {
  columnDef: string;
  header: string;
  cell: (element: any) => string | number;
}

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    IconsModule
  ],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss', '../../scss/buttons.scss'],
})
export class DatatableComponent implements AfterViewInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnDef[] = [];
  @Input() buttons: ButtonConfig[] = [];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  pageSize = 50;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns.map(col => col.columnDef).concat('actions');
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}

import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IconsModule } from '../icons/icons.module';
import { ButtonConfig } from '../models/interfaces';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ButtonGroupComponent,
  ButtonDirective,
  FormCheckLabelDirective,
  ButtonToolbarComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ThemeDirective,
  DropdownComponent,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
} from '@coreui/angular';

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
    IconsModule,
    RouterLink,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonGroupComponent,
    ButtonDirective,
    RouterLink,
    FormCheckLabelDirective,
    ButtonToolbarComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ThemeDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    DropdownDividerDirective,
  ],
  templateUrl: './datatable.component.html',
  styleUrls: [
    './datatable.component.scss',
    '../../scss/buttons.scss',
    '../../scss/datatable.scss',
  ],
})
export class DatatableComponent implements AfterViewInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnDef[] = [];
  @Input() buttons?: ButtonConfig[] = [];
  @Input() buttonsGroup?: ButtonConfig[] = [];
  @Input() iconbuttonsGroup: string = 'list';
  @Input() classGroup: string = 'btn-success';
  @Input() titleGroup: string = 'Menú';
  @Input() showButtonGroup: boolean = false;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  pageSize = 50;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns
      .map((col) => col.columnDef)
      .concat(
        (this.buttons && this.buttons.length > 0) ||
          (this.buttonsGroup && this.buttonsGroup.length > 0)
          ? 'actions'
          : []
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }
}

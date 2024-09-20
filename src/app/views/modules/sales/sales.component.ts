import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { ApiServiceSales } from 'src/app/services/api.service.sales';
import { SaleInfoComplete } from 'src/app/models/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [DatatableComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  sales: SaleInfoComplete[] = [];
  constructor(private apiServiceSales: ApiServiceSales) {}

  ngOnInit(): void {
    this.getAllSales();
  }

  /* Get All Sales */
  getAllSales(): void {
    this.apiServiceSales.getAllSales().subscribe(
      (response) => {
        this.sales = response;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: true,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Se encontraron ' + response.length + ' registros',
        });
      },
      (error) => {
        this.sales = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener las Ventas',
        });
      }
    );
  }

  /* Columns => Datatable */
  columns = [
    { columnDef: 'id', header: 'ID', cell: (element: any) => element.id },
    {
      columnDef: 'totalAmount',
      header: 'Monto',
      cell: (element: any) => '$' + element.totalAmount,
    },
    {
      columnDef: 'date',
      header: 'Fecha de la Venta',
      cell: (element: any) => element.date,
    },
    {
      columnDef: 'typePayment',
      header: 'Forma de Pago',
      cell: (element: any) => element.typePayment,
    },
    {
      columnDef: 'nameEmployee',
      header: 'Atendido Por',
      cell: (element: any) => element.nameEmployee,
    },
  ];

  /* Buttons Datatable */
  buttons = [
    {
      class: 'btn-view',
      icon: 'view', 
      title: 'Ver',
      action: (element: any) => this.onView(element),
    },
    {
      class: 'btn-edit',
      icon: 'pencil',
      title: 'Editar',
      action: (element: any) => this.onEdit(element),
    },
    {
      class: 'btn-delete',
      icon: 'trash',
      title: 'Eliminar',
      action: (element: any) => this.onDelete(element),
    },
  ];

  /* Functions Datatable */
  onView(element: any) {
    console.log('View:', element);
  }

  onEdit(element: any) {
    console.log('Edit:', element);
  }

  onDelete(element: any) {
    console.log('Delete:', element);
  }
}

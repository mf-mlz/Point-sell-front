import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  TemplateIdDirective,
  ThemeDirective,
  WidgetStatAComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { ApiServiceSales } from '../../services/api.service.sales';
import { SaleDate, Sale } from '../../models/interfaces';
import { SwalService } from 'src/app/services/swal.service';
import { GridModule } from '@coreui/angular';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    WidgetsDropdownComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    GridModule,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
  ],
})
export class DashboardComponent implements OnInit {
  sales: Sale[] = [];
  public data: any = null;
  public total: number = 0;

  public options: any = {};

  constructor(
    private apiServiceSales: ApiServiceSales,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getSaleDate();
  }

  getSaleDate(): void {
    const today = new Date();
    const formattedDate = this.getFormattedDate(today, 0);
    const afterFormattedDate = this.getFormattedDate(today, 1);

    const obj: SaleDate = {
      dateBefore: formattedDate,
      dateAfter: afterFormattedDate,
    };

    this.apiServiceSales.postSaleDate(obj).subscribe({
      next: (response) => {
        this.sales = response.sales;
        this.createChart();
      },
      error: (error) => {
        this.sales = [];
        this.swalService.showToast(
          'error',
          'Error',
          error.error?.message ||
            'Ocurrió un Error al Obtener las Ventas Diarias'
        );
      },
    });
  }

  createChart(): void {
    let arrayLabels: string[] = [];
    let arrayTotalAmounts: number[] = [];
    let last10Sales: Sale[] = [];

    if (this.sales.length >= 10) {
      last10Sales = this.sales.slice(-10);
    }

    this.sales.forEach((e) => {
      this.total += e.totalAmount;
    });

    last10Sales.forEach((e) => {
      let totalAmount = e.totalAmount;

      let arrayDate = e.date.split('T');
      let date = arrayDate[0];

      const d = new Date(e.date);
      const day = d.getDate();
      const month = d.getMonth() + 1; // Los meses van de 0 a 11
      const year = d.getFullYear();
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const dateForm = `${day}-${month}-${year} ${hours}:${minutes}`;

      arrayLabels.push(dateForm);
      arrayTotalAmounts.push(totalAmount);
    });

    this.data = {
      labels: arrayLabels,
      datasets: [
        {
          label: '',
          data: arrayTotalAmounts,
          borderColor: '#36A2EB',
          backgroundColor: '#9BD0F5',
        },
      ],
    };
  }

  getFormattedDate(date: Date, d: number): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() + d).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // opciines del Widgets
  // optionsDefault = {
  //   plugins: {
  //     legend: {
  //       display: false
  //     }
  //   },
  //   maintainAspectRatio: true,
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //         drawBorder: false
  //       },
  //       ticks: {
  //         display: false
  //       }
  //     },
  //     y: {
  //       min: 30,
  //       max: 89,
  //       display: false,
  //       grid: {
  //         display: false
  //       },
  //       ticks: {
  //         display: false
  //       }
  //     }
  //   },
  //   elements: {
  //     line: {
  //       borderWidth: 1,
  //       tension: 0.4
  //     },
  //     point: {
  //       radius: 4,
  //       hitRadius: 10,
  //       hoverRadius: 4
  //     }
  //   }
  // };
}

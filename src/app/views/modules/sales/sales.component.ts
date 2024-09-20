import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { ApiServiceSales } from 'src/app/services/api.service.sales';
import {
  SaleInfoComplete,
  PaymentForm,
  Employee,
  Clients,
} from 'src/app/models/interfaces';
import { ModalComponentHtml } from '../../../modalHtml/modalhtml.component';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DOCUMENT, NgClass, CommonModule } from '@angular/common';
import {
  getErrorMessage,
  isFieldInvalid,
} from '../../../utils/form-validations';
import { ApiServicePaymentForms } from '../../../services/api.service.paymentForms';
import { ApiServiceEmployees } from '../../../services/api.service.employees';
import { ApiServiceClients } from '../../../services/api.service.clients';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    DatatableComponent,
    ModalComponentHtml,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
})
export class SalesComponent {
  sales: SaleInfoComplete[] = [];
  paymentsForm: PaymentForm[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filteredPaymentForms: PaymentForm[] = [];
  clients: Clients[] = [];
  filteredClients: Clients[] = [];
  selectedSale: SaleInfoComplete | null = null;
  saleForm!: FormGroup;
  isModalVisible = false;
  titleModal: string = '';
  classModal: string = '';
  error: string | null = null;
  constructor(
    private apiServiceSales: ApiServiceSales,
    private apiServicePaymentForms: ApiServicePaymentForms,
    private apiServiceEmployees: ApiServiceEmployees,
    private apiServiceClients: ApiServiceClients,
    private fb: FormBuilder
  ) {
    /* Init Form and Add Validations */
    this.saleForm = this.fb.group({
      date: ['', [Validators.required, Validators.minLength(3)]],
      totalAmount: ['', [Validators.required, Validators.minLength(3)]],
      payment: [0, [Validators.required, Validators.min(1)]],
      dataPayment: ['', Validators.required],
      typePayment: ['', Validators.required],
      customerId: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      employeesId: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      id: [''],
      status: [0, [Validators.required, Validators.minLength(1)]],
      nameClient: ['', [Validators.required, Validators.minLength(3)]],
      emailClient: [
        '',
        [Validators.required, Validators.minLength(3), Validators.email],
      ],
      taxIdClient: ['', [Validators.required, Validators.minLength(3)]],
      taxSystemClient: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      nameEmployee: ['', [Validators.required, Validators.minLength(3)]],
      emailEmployee: [
        '',
        [Validators.required, Validators.minLength(3), Validators.email],
      ],
    });
  }

  ngOnInit(): void {
    this.getAllSales();
    this.getAllPaymentsForm();
    this.getAllEmployees();
    this.getAllClients();
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

  /* Get All Forms Payment */
  getAllPaymentsForm(): void {
    this.apiServicePaymentForms.getallPaymentsForm().subscribe(
      (response) => {
        this.paymentsForm = response;
      },
      (error) => {
        this.paymentsForm = [];
      }
    );
  }

  /* Get All Employees */
  getAllEmployees(): void {
    this.apiServiceEmployees.allEmployees().subscribe(
      (response) => {
        this.employees = response;
      },
      (error) => {
        this.employees = [];
      }
    );
  }

  /* Get All Clients */
  getAllClients(): void {
    this.apiServiceClients.getAllClients().subscribe(
      (response) => {
        this.clients = response;
      },
      (error) => {
        this.clients = [];
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
    {
      class: 'btn-success',
      icon: 'book',
      title: 'Facturar',
      action: (element: any) => this.onInvoice(element),
    },
  ];

  /* Functions Datatable Buttons -- Open Modals */
  onView(sale: SaleInfoComplete) {
    this.showModal('eye', 'Ver Información de la Venta', sale);
  }

  onEdit(sale: SaleInfoComplete) {
    this.showModal('edit', 'Editar Venta', sale);
  }

  onDelete(sale: SaleInfoComplete) {
    console.log('Delete:', sale);
  }

  onInvoice(sale: SaleInfoComplete) {
    console.log('Invoice:', sale);
  }

  /* Show Modal */
  showModal(classModal: string, title: string, sale: SaleInfoComplete) {
    /* Select Element or Default */
    const defaultSale = {
      date: '',
      totalAmount: '',
      payment: 0,
      dataPayment: '',
      customerId: '',
      employeesId: '',
      id: '',
      status: 0,
      typePayment: '',
      nameClient: '',
      emailClient: '',
      taxIdClient: '',
      taxSystemClient: '',
      nameEmployee: '',
      emailEmployee: '',
    };

    this.selectedSale = sale || defaultSale;

    /* Inti Form => Show Modal */
    this.saleForm.patchValue({
      date: this.selectedSale.date,
      totalAmount: this.selectedSale.totalAmount,
      payment: this.selectedSale.payment,
      dataPayment: this.selectedSale.dataPayment,
      customerId: this.selectedSale.customerId,
      employeesId: this.selectedSale.employeesId,
      id: this.selectedSale.id,
      status: this.selectedSale.status,
      typePayment: this.selectedSale.typePayment,
      nameClient: this.selectedSale.nameClient,
      emailClient: this.selectedSale.emailClient,
      taxIdClient: this.selectedSale.taxIdClient,
      taxSystemClient: this.selectedSale.taxSystemClient,
      nameEmployee: this.selectedSale.nameEmployee,
      emailEmployee: this.selectedSale.emailEmployee,
    });

    /* Pass => Data Modal (Class, Visible and Title) */
    this.isModalVisible = true;
    this.titleModal = title;
    this.classModal = classModal;
  }

  /* Open / Close Modal */
  handleModalVisibilityChange(visible: boolean) {
    this.isModalVisible = visible;
  }

  /* Filter Payment Forms Datalist */
  filterPaymentForms(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredPaymentForms = this.paymentsForm
      .filter(
        (value) =>
          value.id.toString().includes(inputValue) ||
          value.descripcion.includes(inputValue)
      )
      .slice(0, 5);
  }

  /* Get Payment Selected */
  paymentSelected(event: Event) {
    const descriptionPayment = (event.target as HTMLSelectElement).value;
    const selectedPayment = this.filteredPaymentForms.find(
      (payment) => payment.descripcion === descriptionPayment
    );
    if (selectedPayment) {
      this.saleForm.get('typePayment')?.setValue(selectedPayment.descripcion);
      this.saleForm.get('payment')?.setValue(selectedPayment.id);
    } else {
      /* Clear Inputs */
      this.saleForm.get('typePayment')?.setValue('');
      this.saleForm.get('payment')?.setValue('');
      /* Invalidate Inputs */
      this.saleForm.get('typePayment')?.setErrors({ invalid: true });
    }
  }

  /* Filter Employees  */
  filterEmployees(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredEmployees = this.employees
      .filter(
        (value) =>
          value.id.toString().includes(inputValue) ||
          value.name.includes(inputValue)
      )
      .slice(0, 5);
  }

  /* Get Employee Selected */
  employeeSelected(event: Event) {
    const nameEmployee = (event.target as HTMLSelectElement).value;
    const selectedEmployee = this.filteredEmployees.find(
      (employee) => employee.name === nameEmployee
    );
    if (selectedEmployee) {
      this.saleForm.get('emailEmployee')?.setValue(selectedEmployee.email);
      this.saleForm.get('employeesId')?.setValue(selectedEmployee.id);
    } else {
      /* Clear Inputs */
      this.saleForm.get('emailEmployee')?.setValue('');
      this.saleForm.get('employeesId')?.setValue('');
      /* Invalidate Inputs */
      this.saleForm.get('nameEmployee')?.setErrors({ invalid: true });
      this.saleForm.get('emailEmployee')?.setErrors({ invalid: true });
    }
  }

  /* Filter Clients  */
  filterClients(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredClients = this.clients
      .filter(
        (value) =>
          value.id.toString().includes(inputValue) ||
          value.name.includes(inputValue)
      )
      .slice(0, 5);
  }

  /* Get Client Selected */
  clientSelected(event: Event) {
    const nameClient = (event.target as HTMLSelectElement).value;
    const selectedClient = this.filteredClients.find(
      (client) => client.name === nameClient
    );
    if (selectedClient) {
      this.saleForm.get('emailClient')?.setValue(selectedClient.email);
      this.saleForm.get('taxIdClient')?.setValue(selectedClient.tax_id);
      this.saleForm.get('taxSystemClient')?.setValue(selectedClient.tax_system);
      this.saleForm.get('customerId')?.setValue(selectedClient.id);
    } else {
      /* Clear Inputs */
      this.saleForm.get('nameClient')?.setValue('');
      this.saleForm.get('emailClient')?.setValue('');
      this.saleForm.get('taxIdClient')?.setValue('');
      this.saleForm.get('taxSystemClient')?.setValue('');
      this.saleForm.get('customerId')?.setValue('');
      /* Invalidate Inputs */
      this.saleForm.get('nameClient')?.setErrors({ invalid: true });
      this.saleForm.get('emailClient')?.setErrors({ invalid: true });
      this.saleForm.get('taxIdClient')?.setErrors({ invalid: true });
      this.saleForm.get('taxSystemClient')?.setErrors({ invalid: true });
    }
  }

  /* Validation Form */
  getErrorMessage(form: FormGroup, field: string): string {
    return getErrorMessage(form, field);
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    return isFieldInvalid(form, field);
  }

  /* Execute Function Add-Edit-Delete-Create Invoice */
  handleClick(): void {
    switch (this.classModal) {
      case 'edit':
        this.editSale();
        break;

      default:
        break;
    }
  }

  /* Functions */
  editSale(): void {
    if (this.saleForm.valid) {
      const formValue = this.saleForm.value;
      const data = {
        id: Number(formValue.id),
        date: formValue.date,
        payment: Number(formValue.payment),
        dataPayment: Number(formValue.dataPayment),
        totalAmount: Number(formValue.totalAmount),
        customerId: Number(formValue.customerId),
        employeesId: Number(formValue.employeesId),
        status: Number(formValue.status),
      };

      /* Send put Api */
      this.apiServiceSales.editProduct(data).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Venta Modificada con Éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFileInput();
              this.getAllSales();
            }
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Modificar la Venta.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Por favor, ingresa correctamente la información.',
      });
    }
  }

    /* Reset Input File */
    resetFileInput() {
      this.saleForm.reset();
    }

}

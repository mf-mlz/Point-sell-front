import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { ApiServiceSales } from 'src/app/services/api.service.sales';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {
  SaleInfoComplete,
  SaleInvoice,
  PaymentForm,
  Employee,
  Clients,
  SaleProductDescription,
  DeleteRequest,
  ButtonConfig,
  userPayload,
  Invoice,
  InvoiceDownload,
  CancelInvoice,
  InvoiceList,
  InvoiceSendEmail,
} from 'src/app/models/interfaces';
import { ModalComponentHtml } from '../../../modalHtml/modalhtml.component';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationsFormService } from 'src/app/utils/form-validations';
import { ApiServicePaymentForms } from '../../../services/api.service.paymentForms';
import { ApiServiceEmployees } from '../../../services/api.service.employees';
import { ApiServiceClients } from '../../../services/api.service.clients';
import { ApiServiceSalesProducts } from '../../../services/api.service.salesProducts';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceInvoice } from '../../../services/api.service.invoice';
import { IconsModule } from '../../../icons/icons.module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    DatatableComponent,
    ModalComponentHtml,
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
    RouterModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
})
export class SalesComponent {
  idSale: string | null = null;
  showButtonGroupSale: boolean = true;
  showButtonGroupInvoice: boolean = true;
  isAddRoute: boolean = false;
  userPayload: userPayload = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    role_id: 0,
    role_name: '',
    iat: 0,
    exp: 0,
  };
  sales: SaleInfoComplete[] = [];
  saleInvoice: SaleInvoice[] = [];
  paymentsForm: PaymentForm[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filteredPaymentForms: PaymentForm[] = [];
  clients: Clients[] = [];
  filteredClients: Clients[] = [];
  saleProducts: SaleProductDescription[] = [];
  invoicesList: InvoiceList[] = [];
  selectedSale: SaleInfoComplete | null = null;
  saleForm!: FormGroup;
  isModalVisible = false;
  titleModal: string = '';
  classModal: string = '';
  error: string | null = null;
  viewProducts: string | null = null;
  iconGroup: string = 'book';
  titleGroup: string = 'Menú Facturas';
  classGroup: string = 'btn-success';
  public apiUpload = environment.apiUpload;
  constructor(
    private apiServiceSales: ApiServiceSales,
    private apiServicePaymentForms: ApiServicePaymentForms,
    private apiServiceEmployees: ApiServiceEmployees,
    private apiServiceClients: ApiServiceClients,
    private apiServiceSalesProducts: ApiServiceSalesProducts,
    private apiServiceInvoice: ApiServiceInvoice,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    public validationsFormService: ValidationsFormService,
    private route: ActivatedRoute
  ) {
    /* Init Form and Add Validations */
    this.saleForm = this.fb.group({
      date: ['', [Validators.required, Validators.minLength(3)]],
      totalAmount: ['', [Validators.required, Validators.minLength(3)]],
      payment: [0, [Validators.required, Validators.min(1)]],
      dataPayment: ['', Validators.required],
      payment_status: ['', Validators.required],
      rejection_reason: [''],
      typePayment: ['', Validators.required],
      customerId: [''],
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
      nameClient: [''],
      emailClient: [''],
      taxIdClient: [''],
      taxSystemClient: [''],
      nameEmployee: ['', [Validators.required, Validators.minLength(3)]],
      emailEmployee: [
        '',
        [Validators.required, Validators.minLength(3), Validators.email],
      ],
    });
  }

  /* Buttons Datatable */
  buttons: ButtonConfig[] = [];
  buttonsGroup: ButtonConfig[] = [];
  buttonsInvoice: ButtonConfig[] = [];

  ngOnInit(): void {
    this.idSale = '';
    this.route.params.subscribe(params => {
      this.idSale = params['idSale'] || null;
    });

    if(this.idSale){
      this.getSaleById(this.idSale);
    }else{
      this.getAllSales();
    }
    this.userPayload = this.authService.getDecodedToken();
    this.generateButtons();
    this.getAllPaymentsForm();
    this.getAllEmployees();
    this.getAllClients();


  }

  /* Get All Sales */
  getAllSales(): void {
    this.apiServiceSales.getAllSales().subscribe({
      next: (response) => {
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
          title: 'Se encontraron ' + response.length + ' ventas',
        });
      },
      error: (error) => {
        this.sales = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener las Ventas',
        });
      },
    });
  }

  /* Get Sale By Id */
  getSaleById(idSale: string): void {
    this.apiServiceSales.getSaleById(idSale).subscribe({
      next: (response) => {
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
          title: 'Se encontraron ' + response.length + ' ventas',
        });
      },
      error: (error) => {
        this.sales = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener las Ventas',
        });
      },
    });
  }

  /* Get All Forms Payment */
  getAllPaymentsForm(): void {
    this.apiServicePaymentForms.getallPaymentsForm().subscribe({
      next: (response) => {
        this.paymentsForm = response;
      },
      error: (error) => {
        this.paymentsForm = [];
      },
    });
  }

  /* Get All Employees */
  getAllEmployees(): void {
    this.apiServiceEmployees.allEmployees().subscribe({
      next: (response) => {
        this.employees = response;
      },
      error: (error) => {
        this.employees = [];
      },
    });
  }

  /* Get All Clients */
  getAllClients(): void {
    this.apiServiceClients.getAllClients().subscribe({
      next: (response) => {
        this.clients = response;
      },
      error: () => {
        this.clients = [];
      },
    });
  }

  /* Sales Products By ID Sale */
  salesProductsByIdSale(salesId: number): void {
    const data = { salesId };
    this.apiServiceSalesProducts.postFilterDescription(data).subscribe({
      next: (response) => {
        this.saleProducts = response.sales;
      },
      error: () => {
        this.saleProducts = [];
      },
    });
  }

  /* Invoice By Id Sale */
  invoicesByIdSale(salesId: number): void {
    const data = { id_sale: salesId };
    this.apiServiceInvoice.invoicesByIdSale(data).subscribe({
      next: (response) => {
        this.invoicesList = response.invoices;
      },
      error: () => {
        this.invoicesList = [];
      },
    });
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
    {
      columnDef: 'payment_status',
      header: 'Estatus',
      cell: (element: any) => element.payment_status,
    },
  ];

  columnsProductsSale = [
    {
      columnDef: 'photo',
      header: '',
      cell: (element: any) => this.apiUpload + element.photo,
    },
    {
      columnDef: 'quantity',
      header: 'Cantidad',
      cell: (element: any) => element.quantity,
    },
    {
      columnDef: 'descripcion',
      header: 'Descripción',
      cell: (element: any) => element.descripcion,
    },
    {
      columnDef: 'key_sat',
      header: 'Clave Sat',
      cell: (element: any) => element.key_sat,
    },
    {
      columnDef: 'descriptionSat',
      header: 'Descripción Sat',
      cell: (element: any) => element.descriptionSat,
    },
    {
      columnDef: 'price',
      header: 'Precio Unitario',
      cell: (element: any) => '$' + element.price,
    },
    {
      columnDef: 'total',
      header: 'Total',
      cell: (element: any) => '$' + element.price * element.quantity,
    },
  ];

  columnsInvoices = [
    {
      columnDef: 'id',
      header: '#',
      cell: (element: any) => element.id,
    },
    {
      columnDef: 'folio',
      header: 'Folio',
      cell: (element: any) => element.folio,
    },
    {
      columnDef: 'status',
      header: 'Estatus',
      cell: (element: any) => element.status,
    },
    {
      columnDef: 'employee_name',
      header: 'Empleado Generó',
      cell: (element: any) => element.employee_name,
    },
    {
      columnDef: 'employee_cancel_name',
      header: 'Empleado Canceló',
      cell: (element: any) => element.employee_cancel_name,
    },
    {
      columnDef: 'motive',
      header: 'Motivo Cancelación',
      cell: (element: any) => element.motive,
    },
  ];

  /* Generate Btns Datatable */
  generateButtons(): void {
    const buttonsInvoice: ButtonConfig[] = [];
    const btnsGroup: ButtonConfig[] = [
      {
        class: 'btn-delete',
        icon: 'trash',
        title: 'Ver Facturas',
        action: (element: any) => this.onViewInvoice(element),
      },
    ];
    const btns: ButtonConfig[] = [
      {
        class: 'btn-view',
        icon: 'view',
        title: 'Ver',
        action: (element: any) => this.onView(element),
      },
      {
        class: 'btn-view-products',
        icon: 'sharedBox',
        title: 'Ver Productos',
        action: (element: any) => this.onViewProducts(element),
      },
    ];

    if (this.userPayload.role_name === 'Administrador') {
      btns.push(
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
        }
      );
      btnsGroup.push({
        class: 'btn-success',
        icon: 'book',
        title: 'Facturar',
        action: (element: any) => this.onInvoice(element),
      });
      buttonsInvoice.push(
        {
          class: 'btn-download',
          icon: 'download',
          title: 'Descargar Factura',
          action: (element: any) => this.onDownloadInvoice(element),
        },
        {
          class: 'btn-delete',
          icon: 'trash',
          title: 'Cancelar Factura',
          action: (element: any) => this.onCancelInvoice(element),
        },
        {
          class: 'btn-delete',
          icon: 'email',
          title: 'Enviar Factura Por Correo',
          action: (element: any) => this.openSendInvoice(element),
        }
      );
    }

    this.buttons = btns;
    this.buttonsGroup = btnsGroup;
    this.buttonsInvoice = buttonsInvoice;
  }

  /* Functions Datatable Buttons -- Open Modals */
  onView(sale: SaleInfoComplete): void {
    this.showModal('eye', 'Ver Información de la Venta', sale);
  }

  onViewProducts(sale: SaleInfoComplete): void {
    this.showModal('eye', 'Ver Productos de la Venta', sale, 'viewProducts');
  }

  onEdit(sale: SaleInfoComplete): void {
    this.showModal('edit', 'Editar Venta', sale);
  }

  onDelete(sale: SaleInfoComplete): void {
    Swal.fire({
      title: '¿Estás seguro que deseas eliminar?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const obj: DeleteRequest = {
          id: sale.id,
        };
        this.deleteSale(obj);
      }
    });
  }

  onInvoice(sale: SaleInfoComplete): void {
    /* If status => Rechazada */
    if (sale.payment_status === 'Rechazada') {
      Swal.fire({
        icon: 'error',
        title: 'Venta Rechazada',
        text: 'No puedes facturar una venta Rechazada',
      });
    } else if (sale.id_invoice && sale.status_invoice == 'Active') {
      Swal.fire({
        icon: 'info',
        title: 'Factura Existente',
        text: 'La venta ya cuenta con una Factura Activa: ' + sale.folio,
      });
    } else {
      Swal.fire({
        title: '¿Estás seguro que deseas generar la Factura?',
        text: '¡Sólo puedes generar 1 Factura por Venta, verifica que los datos sean correctos!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, generar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const obj: Invoice = {
            customer: sale.customerId,
            id_sale: sale.id,
            id_employee: this.userPayload.id,
          };
          this.createInvoice(obj);
        }
      });
    }
  }

  onDownloadInvoice(invoice: SaleInvoice): void {
    if (invoice.id_invoice) {
      Swal.fire({
        title: 'Descargar Factura',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Descargar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const obj: InvoiceDownload = {
            id_invoice: invoice.id_invoice,
          };
          this.downloadIncoice(obj);
        }
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Sin Factura Registrada',
        text: 'La venta no cuenta con una Factura Registrada',
      });
    }
  }

  onCancelInvoice(invoice: SaleInvoice): void {
    if (invoice.id_invoice && invoice.status === 'Active') {
      this.swalCancel(invoice);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Factura Inexistente o Cancelada',
        text: 'La Factura Seleccionada no sé puede Cancelar',
      });
    }
  }

  openSendInvoice(invoice: SaleInvoice): void {
    if (invoice.id_invoice && invoice.status === 'Active') {
      this.swalSend(invoice);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Factura Inexistente o Cancelada',
        text: 'La Factura Seleccionada no sé puede Enviar',
      });
    }
  }

  onViewInvoice(sale: SaleInfoComplete): void {
    if (sale.payment_status === 'Aprobada') {
      this.showModal('eye', 'Ver Facturas de la Venta', sale, 'viewInvoices');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Venta Rechazada',
        text: 'Las Ventas Rechazadas no cuentan con Facturas',
      });
    }
  }

  /* Show Modal */
  showModal(
    classModal: string,
    title: string,
    sale: SaleInfoComplete,
    viewProducts?: string
  ): void {
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
      payment_status: '',
      rejection_reason: '',
      nameClient: '',
      emailClient: '',
      taxIdClient: '',
      taxSystemClient: '',
      nameEmployee: '',
      emailEmployee: '',
    };

    this.selectedSale = sale || defaultSale;
    this.viewProducts = viewProducts || null;

    /* View Products => Filter Sales Products */
    if (viewProducts == 'viewProducts') {
      this.salesProductsByIdSale(this.selectedSale.id);
    }

    /* View Products => Filter Sales Products */
    if (viewProducts == 'viewInvoices') {
      this.invoicesByIdSale(this.selectedSale.id);
    }

    /* Inti Form => Show Modal */
    this.saleForm.patchValue({
      payment_status: this.selectedSale.payment_status,
      rejection_reason: this.selectedSale.rejection_reason,
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
  handleModalVisibilityChange(visible: boolean): void {
    this.isModalVisible = visible;
  }

  /* Filter Payment Forms Datalist */
  filterPaymentForms(event: Event): void {
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
  paymentSelected(event: Event): void {
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
  filterEmployees(event: Event): void {
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
  employeeSelected(event: Event): void {
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
  filterClients(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredClients = this.clients
      .filter(
        (value) =>
          value.id.toString().includes(inputValue) ||
          value.name.includes(inputValue)
      )
      .slice(0, 10);
  }

  /* Get Client Selected */
  clientSelected(event: Event): void {
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
      /* this.saleForm.get('nameClient')?.setErrors({ invalid: true });
      this.saleForm.get('emailClient')?.setErrors({ invalid: true });
      this.saleForm.get('taxIdClient')?.setErrors({ invalid: true });
      this.saleForm.get('taxSystemClient')?.setErrors({ invalid: true }); */
    }
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
        customerId: formValue.customerId ? Number(formValue.customerId) : null,
        employeesId: Number(formValue.employeesId),
        status: Number(formValue.status),
      };

      this.apiServiceSales.editSale(data).subscribe({
        next: (response) => {
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
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al Modificar la Venta.',
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'Por favor, ingresa correctamente la información.',
      });
    }
  }

  deleteSale(credentials: DeleteRequest): void {
    this.apiServiceSales.deleteSale(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Venta Eliminada Correctamente',
        });
        this.getAllSales();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un Error al Eliminar la Venta',
        });
      },
    });
  }

  createInvoice(credentials: Invoice): void {
    this.apiServiceInvoice.createInvoice(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          title: response.message || 'Factura Generada con Éxito',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllSales();
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un Error al Generar la Factura',
        });
      },
    });
  }

  downloadIncoice(credentials: InvoiceDownload): void {
    this.apiServiceInvoice.downloadInvoice(credentials).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura ID ${credentials.id_invoice}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        /* console.error('Error al descargar la factura:', error); */
      },
    });
  }

  cancelInvoice(credentials: CancelInvoice): void {
    this.apiServiceInvoice.cancelInvoice(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          title: response.message || 'Factura Cancelada con Éxito',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllSales();
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.error || 'Ocurrió un Error al Cancelar la Factura',
        });
      },
    });
  }

  sendInvoice(credentials: InvoiceSendEmail): void {
    this.apiServiceInvoice.sendEmail(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          title: response.message || 'Factura Enviada con Éxito',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllSales();
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.error || 'Ocurrió un Error al Enviar la Factura',
        });
      },
    });
  }

  /* SwalFunctions */
  swalCancel(invoice: SaleInvoice): void {
    Swal.fire({
      title: 'Selecciona el Motivo para Cancelar la Factura',
      input: 'select',
      inputOptions: {
        '01': 'Comprobante emitido con errores con relación. Cuando la factura contiene algún error en las cantidades, claves o cualquier otro dato y ya se ha emitido el comprobante que la sustituye, el cual deberá indicarse por medio del atributo substitution.',
        '02': 'Comprobante emitido con errores sin relación. Cuando la factura contiene algún error en las cantidades, claves o cualquier otro dato y no se requiere relacionar con otra factura.',
        '03': 'No se llevó a cabo la operación. Cuando la venta o transacción no se concretó.',
        '04': 'Operación nominativa relacionada en la factura global. Cuando se trata de un comprobante global que incluye a otros comprobantes.',
      },
      inputPlaceholder: 'Selecciona una opción',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Por favor selecciona una opción');
        }
        return value;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const motivo = result.value;
        const obj: CancelInvoice = {
          id_employee: this.userPayload.id,
          id_invoice: invoice.id_invoice,
          motive: motivo,
        };
        this.cancelInvoice(obj);
      }
    });
  }

  /* Send Email Invoice */
  swalSend(invoice: SaleInvoice): void {
    Swal.fire({
      title: `Enviar Factura - ${invoice.folio}`,
      html: `
        <p>La factura se enviará al siguiente correo:</p>
        <input style="width: 80%;" id="emailInput" class="swal2-input" value="${invoice.email_client}" placeholder="Ingresa el correo" type="email">
      `,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Enviar',
      denyButtonText: `Cancelar`,
      preConfirm: () => {
        const email = (
          document.getElementById('emailInput') as HTMLInputElement
        ).value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailPattern.test(email)) {
          Swal.showValidationMessage('Por favor, ingresa un correo válido');
          return false;
        }
        return { email };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const obj: InvoiceSendEmail = {
          emails: result.value?.email,
          invoiceId: invoice.id_invoice,
        };
        this.sendInvoice(obj);
      }
    });
  }

  /* Reset Input File */
  resetFileInput(): void {
    this.saleForm.reset();
  }

  /* Change Route => Add Sale */
  addSale(): void {
    this.router.navigate(['modules/addSale']);
  }
}

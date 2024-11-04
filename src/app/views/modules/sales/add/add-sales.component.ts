import { Component } from '@angular/core';
import { IconsModule } from '../../../../icons/icons.module';
import { Router } from '@angular/router';
import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DatatableComponent } from 'src/app/datatable/datatable.component';
import { ApiServiceProducts } from 'src/app/services/api.service.products';
import { ApiServiceSales } from 'src/app/services/api.service.sales';
import { AuthService } from '../../../../services/auth.service';
import {
  AddProductSale,
  ProductFilterData,
  ButtonConfig,
  ProductFilter,
  PaymentForm,
  TransactionSale,
  DataCard,
  OpenPayError,
  OpenPayPayment,
  customerOpenPay,
  userPayload,
  RoutePermissions,
} from 'src/app/models/interfaces';
import { ApiServicePaymentForms } from '../../../../services/api.service.paymentForms';
import { ApiServiceSalesProducts } from 'src/app/services/api.service.salesProducts';
import { OpenpayService } from '../../../../services/openpay.service';
import { ValidationsFormService } from 'src/app/utils/form-validations';
import { onKeydownScanner } from '../../../../utils/scanner';
import { encrypt, decrypt } from '../../../../utils/crypto';
import { environment } from '../../../../../environments/environment';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UserService } from 'src/app/services/user.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: [
    '../../../../../scss/forms.scss',
    '../../../../../scss/buttons.scss',
    '../../../../../scss/swal.scss',
  ],
  standalone: true,
  imports: [
    IconsModule,
    FormsModule,
    DatatableComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class AddSalesComponent {
  constructor(
    private router: Router,
    private apiServiceProducts: ApiServiceProducts,
    private apiServicePaymentForms: ApiServicePaymentForms,
    private apiServiceSalesProducts: ApiServiceSalesProducts,
    private apiServiceSales: ApiServiceSales,
    private fb: FormBuilder,
    private openpayService: OpenpayService,
    public validationsFormService: ValidationsFormService,
    private permissionsService: PermissionsService,
    private userService: UserService,
    private swalService: SwalService
  ) {
    this.saleForm = this.fb.group({
      typePayment: ['', [Validators.required]],
      date: ['', [Validators.required]],
      total: ['', [Validators.required]],
      payment: ['', []],
      subtotal: [''],
      iva: [''],
    });
  }
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
  public apiUpload = environment.apiUpload;
  permissions!: RoutePermissions;
  saleForm!: FormGroup;
  paymentsForm: PaymentForm[] = [];
  filteredPaymentForms: PaymentForm[] = [];
  totalSale: string = '$0.00';
  dateSale: string = (() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  })();
  productKey: string = '';
  products: AddProductSale[] = [];
  formData = {
    fecha: '',
    nombre: '',
    total: '$0.00',
    subtotal: '$0.00',
    iva: '$0.00',
  };
  columns = [
    {
      columnDef: 'Photo',
      header: '',
      cell: (element: any) => this.apiUpload + element.photo,
    },
    {
      columnDef: 'Código',
      header: 'Código',
      cell: (element: any) => element.code,
    },
    {
      columnDef: 'name',
      header: 'Descripción',
      cell: (element: any) => element.name,
    },
    {
      columnDef: 'quantity',
      header: 'Cantidad',
      cell: (element: any) => element.quantity,
    },
    {
      columnDef: 'price',
      header: 'Precio',
      cell: (element: any) => this.formatMoneyMx(element.price),
    },
    {
      columnDef: 'total',
      header: 'Total',
      cell: (element: any) =>
        this.formatMoneyMx(element.price * element.quantity),
    },
  ];
  buttons: ButtonConfig[] = [
    {
      class: 'btn-success',
      icon: 'plus',
      title: 'Añadir',
      action: (element: any) => this.removeOrAddProductById(element.id, 'add'),
    },
    {
      class: 'btn-delete',
      icon: 'trash',
      title: 'Eliminar',
      action: (element: any) =>
        this.removeOrAddProductById(element.id, 'remove'),
    },
    {
      class: 'btn-view',
      icon: 'number',
      title: 'Editar Cantidad',
      action: (element: any) => this.editQuantity(element),
    },
  ];

  /* Functions  */
  async ngOnInit(): Promise<void> {
    this.userPayload = await this.userService.getUser();
    this.permissions = this.permissionsService.getPermissions();
    this.products = [];
    this.getAllPaymentsForm();
    this.initForm();
  }

  initForm(): void {
    this.saleForm.patchValue({
      typePayment: '',
      date: this.dateSale,
      total: this.totalSale,
      payment: '',
      iva: this.totalSale,
      subtotal: this.totalSale,
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

  listSale(): void {
    this.router.navigate(['modules/sales']);
  }

  addProduct(): void {
    if (this.productKey) {
      const data = {
        code: this.productKey,
      };
      this.searchProduct(data);
    } else {
      this.swalService.showToast(
        'error',
        'Ingresa la Clave de un Producto para Ingresarlo a la Venta',
        ''
      );
    }
  }

  searchProduct(data: ProductFilterData): void {
    this.apiServiceProducts.filterProducts(data).subscribe({
      next: (response) => {
        if (response.product.length === 1) {
          this.addNewProduct(response.product[0]);
        } else if (response.product.length > 1) {
          this.openSwalMultipleProducts(response.product);
        } else {
          this.swalService.showToast(
            'error',
            `El Producto ${data.code} No Existe`,
            ''
          );
        }
      },
      error: (error) => {
        this.swalService.showToast(
          'error',
          'Ocurrió un error al Obtener el Producto',
          ''
        );
      },
    });
  }

  /* Add Product in the Sale List */
  async addNewProduct(product: AddProductSale): Promise<void> {
    let quantity: number = 1;

    if (product.isGranular) {
      const kg = await this.addKgProductGranuel();
      const productToUpdate = this.products.find(
        (item) => item.id === product.id
      );

      if (productToUpdate) {
        quantity = kg || productToUpdate.quantity;
      } else {
        quantity = kg || 1;
      }
    }

    const newProduct = {
      id: product.id,
      quantity: quantity,
      name: product.name,
      price: product.price,
      code: product.code,
      isGranular: product.isGranular,
      photo: product.photo,
    };

    const checkProductIndex = this.products.findIndex(
      (p) => p.id === product.id
    );

    if (checkProductIndex !== -1) {
      this.products = this.products.map((p, index) =>
        index === checkProductIndex
          ? { ...p, quantity: p.quantity + quantity }
          : p
      );
    } else {
      this.products = [...this.products, newProduct];
    }

    this.getTotalSale();
  }

  /* Insert Kg in Product */
  async addKgProductGranuel(): Promise<number | undefined> {
    return Swal.fire({
      title: 'Ingrese la cantidad de kilos',
      input: 'text',
      inputAttributes: {
        pattern: '[0-9]+([.,][0-9]+)?',
        inputMode: 'decimal',
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      preConfirm: (kilos) => {
        const kilosNum = parseFloat(kilos.replace(',', '.'));
        if (kilosNum <= 0 || isNaN(kilosNum)) {
          Swal.showValidationMessage(
            'Por favor, ingrese un valor válido en kilos'
          );
          return;
        }
        return kilosNum;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        return result.value as number;
      }
      return undefined;
    });
  }

  /* Open Swal Multiple Products */
  async openSwalMultipleProducts(products: ProductFilter[]) {
    const simpleProducts: AddProductSale[] = products.map(
      (product: ProductFilter) => ({
        id: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        code: product.code,
        isGranular: product.isGranular,
        photo: product.photo,
      })
    );

    const inputOptions = simpleProducts.reduce((acc, product) => {
      acc[product.id] = product.code + ' - ' + product.name;
      return acc;
    }, {} as { [key: number]: string });

    const { value: idProduct } = await Swal.fire({
      title: 'Productos Encontrados',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Selecciona un Producto',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (!value) {
            resolve('¡Por favor, selecciona un producto!');
          } else {
            resolve();
          }
        });
      },
    });
    if (idProduct) {
      const productSelected = simpleProducts.filter(
        (p) => p.id === parseInt(idProduct)
      );
      this.addNewProduct(productSelected[0]);
    }
  }

  /* Remove or Add Product */
  removeOrAddProductById(id: number, type: 'add' | 'remove'): void {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );

    if (productIndex !== -1) {
      if (type === 'add') {
        /* Add Quantity */
        this.products = this.products.map((product, index) =>
          index === productIndex
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else if (type === 'remove') {
        /* Remove Quantity */
        if (this.products[productIndex].quantity > 1) {
          this.products = this.products.map((product, index) =>
            index === productIndex
              ? { ...product, quantity: product.quantity - 1 }
              : product
          );
        } else {
          this.products = this.products.filter((product) => product.id !== id);
        }
      }
    }
    this.getTotalSale();
  }

  /* Edit Quantity Manual */
  async editQuantity(productSelected: ProductFilter) {
    const { value: newQuantity } = await Swal.fire({
      title: 'Modificar Cantidad',
      input: productSelected.isGranular ? 'text' : 'number',
      inputLabel: 'Ingresa la Cantidad',
      inputValue: productSelected.quantity.toString(),
      showCancelButton: true,
      inputValidator: (value: string) => {
        if (!value) {
          return 'Ingresa una Cantidad';
        }
        const numValue = productSelected.isGranular
          ? parseFloat(value)
          : Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          return 'Ingresa una Cantidad Válida';
        }
        if (!productSelected.isGranular && !Number.isInteger(numValue)) {
          return 'El Producto No se vende a Granel, ingresa un número Entero';
        }
        return undefined;
      },
    });

    if (newQuantity !== undefined && newQuantity !== null) {
      const parsedQuantity = productSelected.isGranular
        ? parseFloat(newQuantity)
        : Number(newQuantity);
      if (parsedQuantity > 0) {
        const productIndex = this.products.findIndex(
          (product) => product.id === productSelected.id
        );

        if (productIndex !== -1) {
          this.products = this.products.map((product, index) => {
            if (index === productIndex) {
              return { ...product, quantity: parsedQuantity };
            }
            return product;
          });
        }
      }
    }

    this.getTotalSale();
  }

  /* Empty Array Products */
  emptyProducts(): void {
    this.products = [];
    this.getTotalSale();
  }

  /* Change Payment */
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

  /* Get Total Sale */
  getTotalSale(): void {
    const totalSale = this.products.reduce(
      (acc, product) => {
        acc.total += product.price * product.quantity;
        return acc;
      },
      { total: 0 }
    );

    this.totalSale = this.formatMoneyMx(totalSale.total);
    this.saleForm.get('total')?.setValue(this.totalSale);

    /* Calculate IVA 16% and SubTotal */
    const iva = totalSale.total * 0.16;
    const subtotal = totalSale.total - iva;
    this.saleForm.get('subtotal')?.setValue(this.formatMoneyMx(subtotal));
    this.saleForm.get('iva')?.setValue(this.formatMoneyMx(iva));
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  formatMoneyMx = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  /* Submit Form */
  onSubmit(): void {
    if (this.saleForm.valid) {
      /* Sale => $0.00 not Valid */
      if (this.saleForm.value.total === '$0.00' || this.products.length === 0) {
        this.saleForm.get('total')?.markAsDirty();
        this.saleForm.get('total')?.markAsTouched();
        this.saleForm.get('total')?.setErrors({ invalidTotal: true });
      } else {
        /* Sale Information Valid */
        const objData = {
          date: this.saleForm.value.date,
          payment: this.saleForm.value.payment,
          employees: this.userPayload.name,
          total: this.saleForm.value.total,
          typePayment: this.saleForm.value.typePayment,
          products: this.products,
        };
        this.confirmPaymentSale(objData);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ingresa correctamente la información para generar la venta',
      });

      /* Activate Validations Input Required (Type and Data Payment) */
      if (!this.saleForm.value.payment) {
        this.saleForm.get('typePayment')?.markAsDirty();
        this.saleForm.get('typePayment')?.markAsTouched();
        this.saleForm.get('typePayment')?.setErrors({ required: true });
      }
    }
  }

  /* Swal Pay Confirm */
  async confirmPaymentSale(obj: TransactionSale): Promise<void> {
    const totalNumber = parseFloat(obj.total.replace(/[$,]/g, ''));
    /* If Payment is Money => Cash */
    if (obj.typePayment === 'Efectivo') {
      const config: any = {
        title: obj.typePayment,
        html: `<p><strong>Total a Pagar:</strong> ${obj.total}</p>`,
        input: 'number',
        inputValue: totalNumber,
        inputPlaceholder: 'Monto Recibido',
        inputAttributes: {
          step: 'any',
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar Pago',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        customClass: {
          confirmButton: 'btn-confirm',
        },
      };

      const result = await Swal.fire(config);

      if (result.isConfirmed) {
        /* Calculate Change Amount */
        const receivedAmount = parseFloat(result.value);
        const changeAmount = receivedAmount - totalNumber;

        /* If required Change */
        if (receivedAmount >= totalNumber) {
          obj.status = 1;
          obj.dataPayment = '0';
          this.addSale(obj, changeAmount, receivedAmount, 'money');
        } else {
          /* The entered amount is less than the total */
          Swal.fire({
            icon: 'error',
            html: `<strong>El Monto Ingresado es Menor al Monto total de la Venta ${obj.total}</strong>`,
            confirmButtonText: 'Aceptar',
          });
        }
      }
      /* If payment is Credit/Debit Card */
    } else {
      this.openSwalPaymentCard(totalNumber, obj);
    }
  }

  /* Swal Payment Card */
  async openSwalPaymentCard(total: number, obj: TransactionSale) {
    const result = await Swal.fire({
      title: 'Pago con Tarjeta',
      html: `
          <form id="payment-form" style="display: grid;">
            <strong>Titular:</strong> 
            <input style="margin: 10px !important;" id="name_card" class="swal2-input" placeholder="Nombre y Apellido del Titular" required>
  
            <strong>N° Tarjeta:</strong> 
            <input style="margin: 10px !important;" id="card_number" class="swal2-input" placeholder="Número de Tarjeta" required>
    
            <strong>Fecha de Expiración:</strong> 
            <input style="margin: 10px !important;" id="expiration_date" class="swal2-input" placeholder="MM/YYYY" required>
    
            <strong>CVV:</strong> 
            <input style="margin: 10px !important;" id="cvv" class="swal2-input" type="password" placeholder="CVV" required>

             <strong>Email:</strong> 
            <input style="margin: 10px !important;" id="email" class="swal2-input" placeholder="Email del Titular" required>
  
            <input type="hidden" id="deviceIdHiddenFieldName" name="deviceIdHiddenFieldName">
          </form>
      `,
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: () => {
        const expirationDateInput = document.getElementById(
          'expiration_date'
        ) as HTMLInputElement;
        expirationDateInput.addEventListener('input', function (event) {
          let value = expirationDateInput.value.replace(/\D/g, '');
          if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 6);
          }
          expirationDateInput.value = value;
        });
      },
      preConfirm: async () => {
        await this.openpayService.isOpenPayReady();
        OpenPay.deviceData.setup('payment-form', 'deviceIdHiddenFieldName');
        const deviceSessionId = OpenPay.deviceData.setup(
          'payment-form',
          'deviceIdHiddenFieldName'
        );

        const nameCard = (
          document.getElementById('name_card') as HTMLInputElement
        ).value;
        const cardNumber = (
          document.getElementById('card_number') as HTMLInputElement
        ).value;
        const expirationDate = (
          document.getElementById('expiration_date') as HTMLInputElement
        ).value;
        const cvv = (document.getElementById('cvv') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement)
          .value;

        /* Validate Inputs */
        if (!nameCard || !cardNumber || !expirationDate || !cvv || !email) {
          Swal.showValidationMessage('Todos los campos son requeridos');
          return false;
        }

        /* Send Payment */
        const expirateDate = expirationDate.split('/');
        const cardData: DataCard = {
          card_number: parseInt(cardNumber),
          holder_name: nameCard,
          expiration_year: parseInt(expirateDate[1]),
          expiration_month: parseInt(expirateDate[0]),
          cvv2: encrypt(cvv),
        };

        const nameArray = nameCard.split(' ');
        const customer: customerOpenPay = {
          name: nameArray[0],
          lastName: nameArray[1],
          email: email,
        };

        return this.processPaymentOpenPay(
          cardData,
          total,
          deviceSessionId,
          customer,
          obj
        );
      },
    });
  }

  /* Add Sale BD */
  async addSale(
    data: TransactionSale,
    changeAmount: number,
    receivedAmount: number,
    type?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      data.amount = receivedAmount;
      data.changeAmount = changeAmount;
      this.apiServiceSales.addSale(data).subscribe({
        next: (response) => {
          if (type === 'card') {
            resolve(response);
          } else {
            const message =
              changeAmount && changeAmount > 0
                ? `<strong>${
                    response.message
                  }</strong><br>Cambio: ${this.formatMoneyMx(changeAmount)}`
                : `<strong>${response.message}</strong>`;
            Swal.fire({
              icon: 'success',
              html: message,
              confirmButtonText: 'Aceptar',
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                this.downloadPDF(response.idSale);
                this.loadData();
              }
            });
            resolve(response);
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.error || 'Ocurrió un Error al Registrar la Venta',
          });
          reject(error);
        },
      });
    });
  }

  /* Download Ticket */
  downloadPDF(idSale: number) {
    const data = { salesId: idSale };

    this.apiServiceSalesProducts.downloadTicket(data).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF', error);
      },
    });
  }

  /* Payment Card Openpay */
  async processPaymentOpenPay(
    cardData: DataCard,
    totalAmount: number,
    deviceSessionId: string,
    customer: customerOpenPay,
    obj: TransactionSale
  ) {
    try {
      obj.status = 0;
      obj.dataPayment = cardData.card_number.toString();
      cardData.cvv2 = decrypt(cardData.cvv2);
      const saleResponse = await this.addSale(obj, 0, totalAmount, 'card');

      if (saleResponse.idSale) {
        const token = await this.openpayService.createToken(cardData);
        const paymentData: OpenPayPayment = {
          id_order: saleResponse.idSale,
          token: token,
          amount: totalAmount,
          description: 'Pago de Venta N° ' + saleResponse.idSale,
          deviceSessionId: deviceSessionId,
          customer: customer,
        };

        this.openpayService.processPayment(paymentData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Venta Procesada con Éxito',
              text: response.message || 'Venta Pagada con Éxito',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.downloadPDF(saleResponse.idSale);
                this.loadData();
              }
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error.error || 'Ocurrió un Error al Procesar el Pago',
            });
          },
        });
      }

      return true;
    } catch (error) {
      const openPayError = error as OpenPayError;
      const errorMessage =
        openPayError?.data?.description ||
        'Ocurrió un Error al Procesar la Venta';
      Swal.fire({
        icon: 'error',
        title: errorMessage,
      });
      return false;
    }
  }

  /* Reload Data */
  loadData(): void {
    this.totalSale = '$0.00';
    this.productKey = '';
    this.saleForm.reset();
    this.initForm();
    this.products = [];
  }

  /* Scann Product */
  async onKeydownScanner(event: KeyboardEvent, input: string) {
    const result = await onKeydownScanner(event);
    if (result) {
      if (input == 'search') {
        this.productKey = result;
      }
    }
  }
}

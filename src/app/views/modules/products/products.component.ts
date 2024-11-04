import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { DOCUMENT, NgClass, CommonModule } from '@angular/common';
import {
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  RowComponent,
  ColComponent,
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
} from '@coreui/angular';

import { ApiServiceProducts } from '../../../services/api.service.products';
import Swal from 'sweetalert2';
import { ModalComponentHtml } from '../../../modalHtml/modalhtml.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import {
  DeleteRequest,
  Product,
  Category,
  KeySat,
  userPayload,
  ProductFilterData,
  RoutePermissions
} from '../../../models/interfaces';
import { IconsModule } from '../../../icons/icons.module';
import { ValidationsFormService } from '../../../utils/form-validations';
import { onKeydownScanner } from '../../../utils/scanner';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: 'products.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
  standalone: true,
  imports: [
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    CommonModule,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ModalComponentHtml,
    ReactiveFormsModule,
    FormsModule,
    IconDirective,
    IconsModule,
    forwardRef(() => ThemeColorComponent),
  ],
})
export class ProductsComponent implements OnInit {
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
  ProductFilterData: ProductFilterData[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  keySat: KeySat[] = [];
  filteredKeySat: KeySat[] = [];
  selectedProduct: Product | null = null;
  error: string | null = null;
  isModalVisible = false;
  isModalVisibleUpload = false;
  idProductSelect: number | null = null;
  productForm!: FormGroup;
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  titleModal: string = '';
  classModal: string = '';
  nameFile: string = '';
  searchInput: string = '';
  permissions!: RoutePermissions;
  public apiUpload = environment.apiUpload;
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private apiServiceProducts: ApiServiceProducts,
    private fb: FormBuilder,
    private authService: AuthService,
    public validationsFormService: ValidationsFormService,
    private permissionsService: PermissionsService,
    private userService: UserService

  ) {
    /* Init Form and Validations */
    this.productForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(1)]],
      photo: [''],
      photoUpload: [null],
      id: [''],
      key_sat: [0, [Validators.required, Validators.minLength(1)]],
      expiration_date: [0, [Validators.required]],
      isGranular: [false, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.permissions = this.permissionsService.getPermissions();
    this.getAllProducts();
    this.getAllCategories();
    this.getAllKeySat();
  }

  /* Get All Products */
  getAllProducts(): void {
    this.apiServiceProducts.allProducts().subscribe({
      next: (response) => {
        this.products = response;
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
      error: (error) => {
        this.products = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener los Productos',
        });
      },
    });
  }

  /* Filter Products */
  filterProducts(type: string, category?: string): void {
    /* Search by input */
    if (type === 'input') {
      if (this.searchInput) {
        const isCode = /^\d+$/.test(this.searchInput);
        const data: ProductFilterData = isCode
          ? { code: this.searchInput }
          : { name: this.searchInput };
        this.getProductsFilter(data);
      } else {
        this.getAllProducts();
      }
    } else if (type === 'category') {
      const data: ProductFilterData = {
        category: category,
      };
      this.getProductsFilter(data);
    } else if (type === 'stock') {
      const data: ProductFilterData = {
        stock: '10',
      };
      this.getProductsFilter(data);
    }
  }

  /* Filter -- Post */
  getProductsFilter(data: ProductFilterData): void {
    this.apiServiceProducts.filterProducts(data).subscribe({
      next: (response) => {
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
          title: response.message,
        });

        this.products = response.product;
      },
      error: (error) => {
        this.products = [];
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
          icon: 'error',
          title: 'Ocurrió un Error al Obtener los Productos',
        });
      },
    });
  }

  /* Get Categories */
  getAllCategories(): void {
    this.apiServiceProducts.allCategories().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (error) => {
        this.categories = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message ||
            'Ocurrió un Error al Obtener las Categorías',
        });
      },
    });
  }

  /* Get Key Say */
  getAllKeySat(): void {
    this.apiServiceProducts.allKeySat().subscribe({
      next: (response) => {
        this.keySat = response;
      },
      error: (error) => {
        this.keySat = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message ||
            'Ocurrió un Error al Obtener las Claves de Producto',
        });
      },
    });
  }

  /* Filter Key Say Datalist */
  filterKeySat(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredKeySat = this.keySat
      .filter(
        (value) =>
          value.clave.includes(inputValue) ||
          value.descripcion.includes(inputValue)
      )
      .slice(0, 10);
  }

  /* Delete Product -- Modal */
  showModaldeleteProduct(idProduct: number): void {
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
          id: idProduct,
        };
        this.deleteProduct(obj);
      }
    });
  }

  /* Delete Product -- Function */
  deleteProduct(credentials: DeleteRequest): void {
    this.apiServiceProducts.deleteProduct(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Producto Eliminado Correctamente',
        });
        this.getAllProducts();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Eliminar el Producto',
        });
      },
    });
  }

  /* Modal -- Edit/View Product */
  showModal(
    product: Product | null,
    titleModal: string = '',
    classModal: string = '',
    nameFile: string = ''
  ): void {
    const defaultProduct = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      photo: '',
      id: 0,
      key_sat: '',
      expiration_date: '',
      isGranular: false,
      code: ''
    };

    this.selectedProduct = product || defaultProduct;
    const expiration_date = this.selectedProduct?.expiration_date;

    this.productForm.patchValue({
      code: this.selectedProduct?.code ?? '',
      name: this.selectedProduct?.name ?? '',
      description: this.selectedProduct?.description ?? '',
      price: this.selectedProduct?.price ?? 0,
      category: this.selectedProduct?.category ?? '',
      stock: this.selectedProduct?.stock ?? 0,
      photo: this.selectedProduct?.photo ?? '',
      id: this.selectedProduct?.id ?? 0,
      key_sat: this.selectedProduct?.key_sat ?? '',
      expiration_date: expiration_date.split('T')[0] ?? '',
      isGranular: this.selectedProduct?.isGranular ?? false
    });

    this.isModalVisible = true;
    this.titleModal = titleModal;
    this.classModal = classModal;
    this.nameFile = nameFile || 'noImage.png';
  }

  /* Open / Close Modal */
  handleModalVisibilityChange(visible: boolean) {
    this.isModalVisible = visible;
  }

  /* Handle Click */
  handleClick(): void {
    if (this.classModal === 'add') {
      this.addProduct();
    } else if (this.classModal === 'edit') {
      this.editProduct();
    }
  }

  /* Add Product -- Function  */
  addProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      this.apiServiceProducts.registerProducts(formValue).subscribe({
        next: (response) => {
          /* Upload File  */
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('id_product', response.id);
            formData.append('photo', this.selectedFile);
            this.uploadProduct(formData);
          } else {
            Swal.fire({
              icon: 'success',
              title: response.message || 'Producto Añadido con Éxito',
            }).then((result) => {
              if (result.isConfirmed) {
                this.resetFileInput();
                this.getAllProducts();
              }
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Añadir el Producto.',
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

  /* Edit Product -- Function */
  editProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      /* Send Data Put (Edit Product) */
      this.apiServiceProducts.editProduct(formValue).subscribe({
        next: (response) => {
          /* Upload File  */
          if (this.selectedFile) {
            const formData = new FormData();
            formData.append('id_product', formValue.id);
            formData.append('photo', this.selectedFile);
            this.uploadProduct(formData);
          } else {
            Swal.fire({
              icon: 'success',
              title: response.message || 'Producto Modificado con Éxito',
            }).then((result) => {
              if (result.isConfirmed) {
                this.resetFileInput();
                this.getAllProducts();
              }
            });
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Editar el Producto.',
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

  /* Upload Photo -- Function */
  uploadProduct(formData: FormData): void {
    this.apiServiceProducts.uploadFile(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Producto Modificado con Éxito',
        }).then((result) => {
          if (result.isConfirmed) {
            this.resetFileInput();
            this.getAllProducts();
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.error ||
            'Ocurrió un error al Subir la Imágen del Producto.',
        });
      },
    });
  }

  /* Change => File Selected */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const validationError = this.fileTypeValidator(file);
      if (validationError) {
        Swal.fire({
          icon: 'warning',
          title: 'Error',
          text: 'Solo se permiten imágenes (JPG, PNG, GIF, JPEG)',
        });
        return;
      }

      this.selectedFile = file;
    }
  }

  /* Validate Upload => Image */
  fileTypeValidator(file: File): { [key: string]: any } | null {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
    ];
    if (!validImageTypes.includes(file.type)) {
      return { invalidFileType: true };
    }
    return null;
  }

  /* Reset Input File */
  resetFileInput() {
    const fileInput = document.getElementById(
      'photoUpload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedFile = null;
    this.productForm.reset();
  }

  /* Scann Product */
  async onKeydownScanner(event: KeyboardEvent, input: string) {
    const result = await onKeydownScanner(event);
    if (result) {
      if (input == 'search') {
        this.searchInput = result;
      } else if (input == 'modal') {
        this.productForm.get('code')?.setValue(result);
      }
    }
  }
}

@Component({
  selector: 'app-theme-color',
  template: `
    <c-col xl="2" md="4" sm="6" xs="12" class="my-4 ms-4">
      <div [ngClass]="colorClasses" style="padding-top: 75%;"></div>
      <ng-content></ng-content>
    </c-col>
  `,
  standalone: true,
  imports: [ColComponent, NgClass],
})
export class ThemeColorComponent implements OnInit {
  @Input() color = '';
  public colorClasses = {
    'theme-color w-75 rounded mb-3': true,
  };

  @HostBinding('style.display') display = 'contents';

  ngOnInit(): void {
    this.colorClasses = {
      ...this.colorClasses,
      [`bg-${this.color}`]: !!this.color,
    };
  }
}

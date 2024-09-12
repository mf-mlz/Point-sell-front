import {
  AfterViewInit,
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { DOCUMENT, NgClass, CommonModule } from '@angular/common';
import { getStyle, rgbToHex } from '@coreui/utils';
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

import { ApiServiceProducts } from '../../services/api.service.products';
import Swal from 'sweetalert2';
import { ModalComponentHtml } from '../../modalHtml/modalhtml.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';

/* Interfaces */
interface DeleteProductRequest {
  id: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  photo: string;
  key_sat: string;
}

interface Category {
  category: string;
}

interface KeySat {
  clave: string;
  descripcion: string;
}

@Component({
  templateUrl: 'products.component.html',
  styleUrls: ['./products.component.scss'],
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
    forwardRef(() => ThemeColorComponent),
  ],
})
export class ProductsComponent implements OnInit {
  public userPayload: any;
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
  public apiUpload = environment.apiUpload;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private apiServiceProducts: ApiServiceProducts,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(1)]],
      photo: ['', [Validators.required, Validators.minLength(3)]],
      photoUpload: [null, [Validators.required]],
      id: ['', [Validators.required, Validators.minLength(1)]],
      key_sat: [0, [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.userPayload = this.userService.userPayload;
    this.getAllProducts();
    this.getAllCategories();
    this.getAllKeySat();
  }

  /* Get All Products */
  getAllProducts(): void {
    this.apiServiceProducts.allProducts().subscribe(
      (response) => {
        this.products = response;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Se encontraron '+ response.length +' registros',
        });
      },
      (error) => {
        this.products = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener los Productos',
        });
      }
    );
  }

  /* Filter Products */
  filterProducts(type: string, category?: string): void {
    /* Search by input */
    if (type === 'input') {
      if (this.searchInput) {
        const isInteger = /^-?\d+$/.test(this.searchInput);
        const data = isInteger
          ? { id: this.searchInput }
          : { name: this.searchInput };
        this.getProductsFilter(data);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Ingresa un Valor a Buscar',
        });
      }
    } else if (type === 'category') {
      const data = {
        category: category,
      };
      this.getProductsFilter(data);
    }
  }

  /* Filter -- Post */
  getProductsFilter(data: any): void {
    this.apiServiceProducts.filterProducts(data).subscribe(
      (response) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
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
      (error) => {
        this.products = [];
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Ocurrio un Error al Obtener los Productos',
        });
      }
    );
  }

  /* Get Categories */
  getAllCategories(): void {
    this.apiServiceProducts.allCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        this.categories = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message ||
            'Ocurrió un Error al Obtener las Categorias',
        });
      }
    );
  }

  /* Get Key Say */
  getAllKeySat(): void {
    this.apiServiceProducts.allKeySat().subscribe(
      (response) => {
        this.keySat = response;
      },
      (error) => {
        this.keySat = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message ||
            'Ocurrió un Error al Obtener las Claves de Producto',
        });
      }
    );
  }

  filterKeySat(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredKeySat = this.keySat
      .filter(
        (value) =>
          value.clave.includes(inputValue) ||
          value.descripcion.includes(inputValue)
      )
      .slice(0, 5);
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
        const obj: DeleteProductRequest = {
          id: idProduct,
        };
        this.deleteProduct(obj);
      }
    });
  }

  /* Delete Product -- Function */
  deleteProduct(credentials: DeleteProductRequest): void {
    this.apiServiceProducts.deleteProduct(credentials).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Producto Eliminado Correctamente',
        });
        this.getAllProducts();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Eliminar el Producto',
        });
      }
    );
  }

  /* Modal -- Edit Product */
  showModal(
    product: any,
    titleModal: string,
    classModal: string,
    nameFile: string
  ): void {
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      photo: product.photo,
      id: product.id,
      key_sat: product.key_sat,
    });
    this.isModalVisible = true;
    this.titleModal = titleModal;
    this.classModal = classModal;
    this.nameFile = nameFile;
  }

  handleModalVisibilityChange(visible: boolean) {
    this.isModalVisible = visible;
  }

  /* Edit Product */
  editProduct(): void {
    if (this.productForm.valid && this.selectedFile) {
      const formValue = this.productForm.value;

      const formData = new FormData();
      formData.append('id_product', formValue.id);
      formData.append('photo', this.selectedFile);

      /* Send Data Put (Edit Product) */
      this.apiServiceProducts.editProduct(formValue).subscribe(
        (response) => {
          /* Upload File  */
          this.uploadProduct(formData);
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Editar el Producto.',
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

  /* Modal Upload File */
  showModalUpload(id: number): void {
    this.idProductSelect = id;
    this.uploadForm.get('photoUpload')?.reset();
    this.uploadForm.patchValue({
      id: id,
    });
    this.isModalVisibleUpload = true;
  }

  /* Upload Photo */
  uploadProduct(formData: FormData): void {
    this.apiServiceProducts.uploadFile(formData).subscribe(
      (response) => {
        this.resetFileInput();
        Swal.fire({
          icon: 'success',
          title: response.message || 'Producto Modificado con Éxito',
        });
        this.getAllProducts();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error.error ||
            'Ocurrió un error al Subir la Imágen del Producto.',
        });
      }
    );
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

  /* Validate Fields Form */
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /* Validate Errors Fields Form */
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) {
      return 'El Campo es Requerido';
    } else if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Ingresa Minímo ${minLength} Caracteres`;
    } else if (control?.hasError('invalidFileType')) {
      return 'Solo se permiten imágenes (JPG, PNG, GIF, JPEG)';
    }
    return '';
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

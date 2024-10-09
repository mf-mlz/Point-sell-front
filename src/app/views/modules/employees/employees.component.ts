import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Renderer2,
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

import { ApiServiceEmployees } from '../../../services/api.service.employees';
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
import { cilPlus, cilShieldAlt } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import {
  DeleteRequest,
  Employee,
  Rol,
  KeySat,
  Category,
} from '../../../models/interfaces';

@Component({
  templateUrl: 'employees.component.html',
  styleUrls: ['./employees.component.scss'],
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
    forwardRef(() => ThemeColorComponent),
  ],
})
export class EmployeesComponent implements OnInit {
  public userPayload: any;
  employees: Employee[] = [];
  roles: Rol[] = [];
  keySat: KeySat[] = [];
  filteredKeySat: KeySat[] = [];
  selectedEmployee: Employee | null = null;
  error: string | null = null;
  isModalVisible = false;
  isModalVisibleUpload = false;
  idEmployeeSelect: number | null = null;
  employeeForm!: FormGroup;
  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  titleModal: string = '';
  classModal: string = '';
  nameFile: string = '';
  searchInput: string = '';
  icons = { cilPlus, cilShieldAlt };
  public apiUpload = environment.apiUpload;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ApiServiceEmployees: ApiServiceEmployees,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.employeeForm = this.fb.group({
      name: ['' /* , [Validators.required, Validators.minLength(3)] */],
      email: ['' /* , [Validators.required, Validators.minLength(10)] */],
      password: ['' /* , [Validators.required, Validators.min(1)] */],
      phone: ['' /* , Validators.required, Validators.min(1) */],
      address: ['' /* , [Validators.required, Validators.min(1)] */],
      status: [''],
      created_at: [''],
      updated_at: [''],
      role_id: [0 /* , [Validators.required, Validators.minLength(1)] */],
      id: [0 /* , [Validators.required, Validators.minLength(3)] */],
    });
  }
  ngOnInit(): void {
    this.userPayload = this.authService.getDecodedToken();
    this.getAllEmployees();
    this.getRolesAll();
  }

  /* Get All employee */
  getAllEmployees(): void {
    this.ApiServiceEmployees.allEmployees().subscribe({
      next: (response) => {
        this.employees = response;
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
        this.employees = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener los Empleados',
        });
      },
    });
  }

  //   /* Filter employee */
  filterEmployees(type: string): void {
    /* Search by input */
    if (type === 'input') {
      if (this.searchInput) {
        const data = { search: this.searchInput };
        this.getEmployeesFilter(data);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Ingresa un Valor a Buscar',
        });
      }
    }
  }

  //   /* Filter -- Post */
  getEmployeesFilter(data: any): void {
    this.ApiServiceEmployees.filterEmployeesAll(data).subscribe({
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

        this.employees = response.employee;
      },
      error: (error) => {
        this.employees = [];
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
          title: 'Ocurrió un Error al Obtener los Empleados',
        });
      },
    });
  }

  //   /* Delete Product -- Modal */
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
        this.deleteEmployee(obj);
      }
    });
  }

  //   /* Delete Product -- Function */
  deleteEmployee(credentials: DeleteRequest): void {
    this.ApiServiceEmployees.deleteEmployee(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Empleado Eliminado Correctamente',
        });
        this.getAllEmployees();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Eliminar el Empleado',
        });
      },
    });
  }

  //   /* Modal -- Edit/View Employee */
  showModal(
    employee?: any,
    titleModal: string = '',
    classModal: string = '',
    nameFile: string = ''
  ): void {
    const defaultEmployee = {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      status: '',
      created_at: '',
      updated_at: '',
      role_id: '',
    };

    this.selectedEmployee = employee || defaultEmployee;

    this.employeeForm.patchValue({
      id: this.selectedEmployee?.id ?? '',
      name: this.selectedEmployee?.name ?? '',
      email: this.selectedEmployee?.email ?? '',
      password: this.selectedEmployee?.password ?? '',
      phone: this.selectedEmployee?.phone ?? 0,
      address: this.selectedEmployee?.address ?? '',
      status: this.selectedEmployee?.status ?? '',
      created_at: this.selectedEmployee?.created_at ?? '',
      updated_at: this.selectedEmployee?.updated_at ?? '',
      role_id: this.selectedEmployee?.role_id ?? '',
    });
    this.isModalVisible = true;
    this.titleModal = titleModal;
    this.classModal = classModal;
    this.nameFile = nameFile || 'noImage.png';
  }

  handleModalVisibilityChange(visible: boolean) {
    this.isModalVisible = visible;
  }

  //   /* Handle Click */
  handleClick(): void {
    if (this.classModal === 'add') {
      this.addEmployee();
    } else if (this.classModal === 'edit') {
      this.editEmployee();
    }
  }

  //   /* Add Product  */
  addEmployee(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      this.ApiServiceEmployees.registerEmployee(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Empleado Añadido con Éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFileInput();
              this.getAllEmployees();
            }
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Añadir el Empleado.',
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

  //   /* Edit Product */
  editEmployee(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      /* Send Data Put (Edit Employee) */
      this.ApiServiceEmployees.editEmployee(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Empleado Modificado con Éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFileInput();
              this.getAllEmployees();
            }
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error?.message || 'Ocurrió un error al Editar el Empleado.',
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

  //   /* Modal Upload File */
  showModalUpload(id: number): void {
    this.idEmployeeSelect = id;
    this.uploadForm.get('photoUpload')?.reset();
    this.uploadForm.patchValue({
      id: id,
    });
    this.isModalVisibleUpload = true;
  }

  //   /* Change => File Selected */
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

  //   /* Reset Input File */
  resetFileInput() {
    const fileInput = document.getElementById(
      'photoUpload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedFile = null;
    this.employeeForm.reset();
  }

  //   /* Validate Fields Form */
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  //   /* Validate Errors Fields Form */
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

  censorEmail(email: string): string {
    const [user, domain] = email.split('@');
    if (!user || !domain) {
      throw new Error('Dirección de correo electrónico inválida');
    }
    const visibleLength = 3; // Número de caracteres visibles al principio del nombre de usuario
    const censoredUser =
      user.slice(0, visibleLength) + '*'.repeat(user.length - visibleLength);
    return `${censoredUser}@${domain}`;
  }

  /* Get roles */
  getRolesAll(): void {
    this.ApiServiceEmployees.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        this.roles = [];
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

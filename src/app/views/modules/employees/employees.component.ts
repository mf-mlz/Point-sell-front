import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { RouterModule } from '@angular/router';
import {
  Employee,
  DeleteRequest,
  ButtonConfig,
  userPayload,
  EmployeeFilter,
  Roles,
  RoutePermissions,
} from 'src/app/models/interfaces';
import { ModalComponentHtml } from '../../../modalHtml/modalhtml.component';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationsFormService } from 'src/app/utils/form-validations';
import { ApiServiceEmployees } from '../../../services/api.service.employees';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceRoles } from '../../../services/api.service.roles';
import { IconsModule } from '../../../icons/icons.module';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    DatatableComponent,
    ModalComponentHtml,
    CommonModule,
    ReactiveFormsModule,
    IconsModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
})
export class EmployeesComponent {
  idEmployeeSearch: string = '';
  showButtonGroupEmployee: boolean = false;
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

  employees: Employee[] = [];
  roles: Roles[] = [];
  selectedEmployee: Employee | null = null;
  employeeForm: FormGroup;
  isModalVisible = false;
  titleModal: string = '';
  classModal: string = '';
  error: string | null = null;
  permissions!: RoutePermissions;
  constructor(
    private apiServiceEmployees: ApiServiceEmployees,
    private apiServiceRoles: ApiServiceRoles,
    private authService: AuthService,
    private fb: FormBuilder,
    public validationsFormService: ValidationsFormService,
    private permissionsService: PermissionsService,
    private userService: UserService
  ) {
    /* Init Form and Add Validations */
    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', [Validators.required]],
      role: [''],
      role_id: ['', [Validators.required]],
    });
  }

  /* Buttons Datatable */
  buttons: ButtonConfig[] = [];

  async ngOnInit(): Promise<void> {
    this.permissions = this.permissionsService.getPermissions();
    this.generateButtons();
    this.getAllEmployees();
    this.getAllRoles();
  }


  /* Get Employee By Id */
  getEmployeeById(employee: EmployeeFilter): void {
    this.apiServiceEmployees.filter(employee).subscribe({
      next: (response) => {
        this.employees = response.employee;
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

  /* Get All Employees */
  getAllEmployees(): void {
    this.apiServiceEmployees.allEmployees().subscribe({
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
          title:
            response.message || `Se encontraron ${response.length} registros`,
        });
      },
      error: (error) => {
        this.employees = [];
      },
    });
  }

  /* Get All Roles */
  getAllRoles(): void {
    this.apiServiceRoles.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (error) => {
        this.roles = [];
      },
    });
  }

  /* Columns => Datatable */
  columns = [
    { columnDef: 'id', header: 'ID', cell: (element: any) => element.id },
    {
      columnDef: 'name',
      header: 'Nombre',
      cell: (element: any) => element.name,
    },
    {
      columnDef: 'phone',
      header: 'Télefono',
      cell: (element: any) => element.phone,
    },
    {
      columnDef: 'email',
      header: 'E-mail',
      cell: (element: any) => element.email,
    },
    {
      columnDef: 'role',
      header: 'Rol',
      cell: (element: any) => element.role,
    },
  ];

  /* Generate Btns Datatable */
  generateButtons(): void {
    const btns: ButtonConfig[] = [];

    if (this.permissions && this.permissions.view) {
      btns.push({
        class: 'btn-view',
        icon: 'view',
        title: 'Ver',
        action: (element: any) => this.onView(element),
      });
    }

    if (this.permissions && this.permissions.edit) {
      btns.push({
        class: 'btn-edit',
        icon: 'pencil',
        title: 'Editar',
        action: (element: any) => this.onEdit(element),
      });
    }

    if (this.permissions && this.permissions.delete) {
      btns.push({
        class: 'btn-delete',
        icon: 'trash',
        title: 'Eliminar',
        action: (element: any) => this.onDelete(element),
      });
    }

    this.buttons = btns;
  }

  /* Functions Datatable Buttons -- Open Modals */
  onAdd(): void {
    this.showModal('add', 'Añadir Empleado');
  }

  onView(employee: Employee): void {
    this.showModal('eye', 'Ver Información del Empleado', employee);
  }

  onEdit(employee: Employee): void {
    this.showModal('edit', 'Editar Empleado', employee);
  }

  onDelete(employee: Employee): void {
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
          id: employee.id,
        };
        this.deleteSale(obj);
      }
    });
  }

  /* Show Modal */
  showModal(classModal: string, title: string, employee?: Employee): void {
    /* Select Element or Default */
    const defaultSale = {
      id: 0,
      name: '',
      email: '',
      phone: 0,
      address: '',
      status: '',
      role: '',
      role_id: 0,
      created_at: '',
      updated_at: '',
    };

    this.selectedEmployee = employee ? employee : defaultSale;

    /* Inti Form => Show Modal */
    this.employeeForm.patchValue({
      id: this.selectedEmployee?.id || 0,
      name: this.selectedEmployee?.name || '',
      email: this.selectedEmployee?.email || '',
      phone: this.selectedEmployee?.phone || '',
      address: this.selectedEmployee?.address || '',
      status: this.selectedEmployee?.status || '',
      role_id: this.selectedEmployee?.role_id || 0,
      role: this.selectedEmployee?.role || '',
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

  /* Execute Function Add-Edit-Delete-Create Invoice */
  handleClick(): void {
    switch (this.classModal) {
      case 'edit':
        this.editEmployee();
        break;
      case 'add':
        this.addEmployee();
        break;
      default:
        break;
    }
  }

  /* Functions */
  addEmployee(): void {
    if (this.employeeForm.valid) {
      let formValue = this.employeeForm.value;
      const temporaryPassword = this.createTemporaryPassword(formValue);
      formValue.password = temporaryPassword;
      this.apiServiceEmployees.registerEmployee(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'info',
            title:
              `<strong>${response.message}</strong>` ||
              '<strong> Empleado Agregado con Éxito </strong>',
            html: `Por favor, proporcionale al Empleado su Contraseña Temporal: <br><br><b> ${temporaryPassword} </b><br><br>
                  Para cambiar la contraseña es necesario ingresar al Sistema y dar clic en el apartado <br><br><strong> Cambiar Contraseña </strong>`,
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
            text: 'Ocurrió un error al Agregar el Empleado, verifica que el Correo y el Télefono no estén registrados en otro empleado Activo',
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

  editEmployee(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const controlErrors = this.employeeForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`Errores en el control ${key}:`, controlErrors);
      }
    });
    
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      this.apiServiceEmployees.editEmployee(formValue).subscribe({
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
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al Modificar el Empleado, verifica que el Correo y el Télefono no estén registrados en otro empleado Activo',
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
    this.apiServiceEmployees.deleteEmployee(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Empleado Eliminado Correctamente',
        });
        this.getAllEmployees();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un Error al Eliminar el Empleado',
        });
      },
    });
  }

  /* Create Temporary Password */
  createTemporaryPassword(employee: Employee): string {
    const arrayPassword: string[] = [];

    for (const key in employee) {
      if (employee.hasOwnProperty(key)) {
        const value = employee[key as keyof Employee];

        if (typeof value === 'string' && value.length > 0) {
          const valueArr = value.replace(/\s+/g, '').split('');
          const lengthArr = valueArr.length;

          for (let index = 0; index < 2; index++) {
            const randomIndex = Math.floor(Math.random() * lengthArr);
            const randomChar = valueArr[randomIndex];
            if (randomChar !== '') {
              arrayPassword.push(randomChar);
            }
          }
        }
      }
    }
    const password = arrayPassword.join('');
    return password;
  }

  /* Search Employee */
  searchEmployee(): void {
    if (this.idEmployeeSearch) {
      const isNumber = (value: string | number) => /^\d+$/.test(String(value));
      const isValid = isNumber(this.idEmployeeSearch);
      let data = null;

      if (isValid) {
        data = {
          id: Number(this.idEmployeeSearch),
        };
      } else {
        data = {
          name: this.idEmployeeSearch.toString(),
        };
      }

      this.getEmployeeById(data);
    } else {
      this.getAllEmployees();
    }
  }

  /* Reset Input File */
  resetFileInput(): void {
    this.employeeForm.reset();
  }
}

import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { RouterModule } from '@angular/router';
import {
  ButtonConfig,
  userPayload,
  Roles,
  Permissions,
  RoutePermissions,
} from '../../../models/interfaces';
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
import { ValidationsFormService } from '../../../../../src/app/utils/form-validations';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceRoles } from '../../../services/api.service.roles';
import { IconsModule } from '../../../icons/icons.module';
import { ApiServicePermissions } from '../../../services/api.service.permissions';
import { NavService } from 'src/app/layout/default-layout/_nav';
import { INavData } from '@coreui/angular';
import { PermissionsService } from 'src/app/services/permissionsService';

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
  templateUrl: './modules.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
})
export class ModulesComponent {
  idpPermissionsSearch: string = '';
  thishowButtonGroupPermissions: boolean = false;
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

  permissions: Permissions[] = [];
  roles: Roles[] = [];
  selectedPermissions: Permissions | null = null;
  permissionsForm: FormGroup;
  isModalVisible = false;
  titleModal: string = '';
  classModal: string = '';
  error: string | null = null;
  permissionsModule!: RoutePermissions;
  public navItems: INavData[] = [];
  constructor(
    private apiServiceRoles: ApiServiceRoles,
    private apiServicePermissions: ApiServicePermissions,
    private authService: AuthService,
    private fb: FormBuilder,
    public validationsFormService: ValidationsFormService,
    private navService: NavService,
    private permissionsService: PermissionsService
  ) {
    /* Init Form and Add Validations */
    this.permissionsForm = this.fb.group({
      id: [''],
      role_id: ['', [Validators.required]],
      module: ['', [Validators.required]],
      permissions: [''],
      name_rol: [''],
      add: [false],
      edit: [false],
      delete: [false],
      view: [false],
      access: [false],
      type: ['']
    });
  }

  /* Buttons Datatable */
  buttons: ButtonConfig[] = [];

  ngOnInit(): void {
    this.userPayload = this.authService.getDecodedToken();
    this.permissionsModule = this.permissionsService.getPermissions();
    this.generateButtons();
    this.getAllPermissions();
    this.getAllRoles();
    this.getRoutes();
  }

  /* Get Routes */
  getRoutes(): void {
    this.navItems = this.navService.allItems();

    for (let index = 0; index < this.navItems.length; index++) {
      const element = this.navItems[index];
      if (element.children) {
        for (let index = 0; index < element.children.length; index++) {
          const children = element.children[index];
          this.navItems = [...this.navItems, children];
        }
      }
    }

    /* Order Nav Items By Name */
    this.navItems = this.navItems.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return a.name ? -1 : 1;
    });

    /* Quit Dashboard */
    this.navItems = this.navItems.filter(item => item.name !== 'Dashboard');
    
  }

  /* Get Permission By Id */
  getPermissionsById(permission: Permissions): void {
    this.apiServicePermissions.filter(permission).subscribe({
      next: (response) => {
        this.permissions = response.permissions;
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
            response.message ||
            `Se encontraron  ${response.permissions.length} registros`,
        });
      },
      error: (error) => {
        this.permissions = [];
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.error?.message || 'Ocurrió un Error al Obtener los Permisos',
        });
      },
    });
  }

  /* Get All Permissions */
  getAllPermissions(): void {
    this.apiServicePermissions.all().subscribe({
      next: (response) => {
        this.permissions = response.permissions;
        
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
            response.message ||
            `Se encontraron ${response.permissions.length} registros`,
        });
      },
      error: (error) => {
        this.permissions = [];
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
      columnDef: 'name_rol',
      header: 'Rol',
      cell: (element: any) => element.name_rol,
    },
    {
      columnDef: 'module',
      header: 'Módulo',
      cell: (element: any) => element.module,
    },
    {
      columnDef: 'permissions',
      header: 'Permisos',
      cell: (element: any) => element.permissions.replace(/,/g, ' | '),
    },
  ];

  /* Generate Btns Datatable */
  generateButtons(): void {
    const btns: ButtonConfig[] = [];

    if (this.permissionsModule.view) {
      btns.push({
        class: 'btn-view',
        icon: 'view',
        title: 'Ver',
        action: (element: any) => this.onView(element),
      });
    }

    if (this.permissionsModule.edit) {
      btns.push({
        class: 'btn-edit',
        icon: 'pencil',
        title: 'Editar',
        action: (element: any) => this.onEdit(element),
      });
    }

    if (this.permissionsModule.delete) {
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
    this.showModal('add', 'Añadir Permiso');
  }

  onView(permissions: Permissions): void {
    this.showModal('eye', 'Ver Información del Permiso', permissions);
  }

  onEdit(permissions: Permissions): void {
    if (permissions.module !== 'Dashboard') {
      this.showModal('edit', 'Editar Permiso', permissions);
    } else {
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
        title: 'No se pueden editar los permisos del Módulo Principal',
      });
    }
  }

  onDelete(permissions: Permissions): void {
    if (permissions.module !== 'Dashboard') {
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
          const obj: Permissions = {
            id: permissions.id,
          };
          this.deletePermissions(obj);
        }
      });
    } else {
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
        title: 'No se pueden eliminar los permisos del Módulo Principal',
      });
    }
  }

  /* Show Modal */
  showModal(classModal: string, title: string, permission?: Permissions): void {
    /* Select Element or Default */
    const defaultPermission = {
      id: 0,
      role_id: '',
      module: '',
      name_rol: '',
      add: false,
      edit: false,
      delete: false,
      view: false,
      access: false,
      type: ''
    };

    this.selectedPermissions = permission ? permission : defaultPermission;

    const permissionsArray = this.selectedPermissions?.permissions
      ? this.selectedPermissions?.permissions.split(',')
      : [];

    /* Inti Form => Show Modal */
    this.permissionsForm.patchValue({
      id: this.selectedPermissions?.id || 0,
      role_id: this.selectedPermissions?.role_id || '',
      module: this.selectedPermissions?.module || '',
      name_rol: this.selectedPermissions?.name_rol || '',
      add: permissionsArray.includes('add'),
      edit: permissionsArray.includes('edit'),
      delete: permissionsArray.includes('delete'),
      view: permissionsArray.includes('view'),
      access: permissionsArray.includes('access'),
      type: this.selectedPermissions?.type || ''
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
        this.editPermissions();
        break;
      case 'add':
        this.addPermissions();
        break;
      default:
        break;
    }
  }

  /* Functions */
  addPermissions(): void {
    if (this.permissionsForm.valid) {
      /* Permissions String */
      const permissionsString = Object.keys(this.permissionsForm.value)
        .filter(
          (key) =>
            typeof this.permissionsForm.value[key] === 'boolean' &&
            this.permissionsForm.value[key]
        )
        .join(',');

      let formValue = this.permissionsForm.value;
      formValue.role_id = Number(formValue.role_id);
      formValue.permissions = permissionsString;
      delete formValue.id;
      this.apiServicePermissions.register(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Permiso Insertado con Éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFileInput();
              this.getAllPermissions();
            }
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al Agregar el Permiso',
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

  editPermissions(): void {
    if (this.permissionsForm.valid) {
      /* Permissions String */
      const permissionsString = Object.keys(this.permissionsForm.value)
        .filter(
          (key) =>
            typeof this.permissionsForm.value[key] === 'boolean' &&
            this.permissionsForm.value[key]
        )
        .join(',');
      const formValue = this.permissionsForm.value;
      formValue.permissions = permissionsString;
      this.apiServicePermissions.edit(formValue).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: response.message || 'Permiso Modificado con Éxito',
          }).then((result) => {
            if (result.isConfirmed) {
              this.resetFileInput();
              this.getAllPermissions();
            }
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al Modificar el Permiso',
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

  deletePermissions(credentials: Permissions): void {
    this.apiServicePermissions.delete(credentials).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Permiso Eliminado Correctamente',
        });
        this.getAllPermissions();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un Error al Eliminar el Permiso',
        });
      },
    });
  }

  /* Search Permissions */
  searchPermissions(): void {
    if (this.idpPermissionsSearch) {
      const isNumber = (value: string | number) => /^\d+$/.test(String(value));
      const isValid = isNumber(this.idpPermissionsSearch);
      let data = null;

      if (isValid) {
        data = {
          id: Number(this.idpPermissionsSearch),
        };
      } else {
        data = {
          module: this.idpPermissionsSearch.toString(),
        };
      }

      this.getPermissionsById(data);
    } else {
      this.getAllPermissions();
    }
  }

  /* Reset Input File */
  resetFileInput(): void {
    this.permissionsForm.reset();
  }
}

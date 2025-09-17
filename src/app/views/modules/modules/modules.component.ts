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
import { ApiServiceRoles } from '../../../services/api.service.roles';
import { IconsModule } from '../../../icons/icons.module';
import { ApiServicePermissions } from '../../../services/api.service.permissions';
import { NavService } from 'src/app/layout/default-layout/_nav';
import { INavData } from '@coreui/angular';
import { PermissionsService } from 'src/app/services/permissions.service';
import { SwalService } from 'src/app/services/swal.service';

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
    photo: '',
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
    private fb: FormBuilder,
    public validationsFormService: ValidationsFormService,
    private navService: NavService,
    private permissionsService: PermissionsService,
    private swalService: SwalService
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
      type: [''],
    });
  }

  /* Buttons Datatable */
  buttons: ButtonConfig[] = [];

  async ngOnInit(): Promise<void> {
    this.permissionsModule = this.permissionsService.getPermissions();
    this.generateButtons();
    this.getAllPermissions();
    this.getAllRoles();
    this.getRoutes();
  }

  /* Get Routes */
  async getRoutes(): Promise<void> {
    this.navItems = await this.navService.allItems();

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
    this.navItems = this.navItems.filter((item) => item.name !== 'Dashboard');
  }

  /* Get Permission By Id */
  getPermissionsById(permission: Permissions): void {
    this.apiServicePermissions.filter(permission).subscribe({
      next: (response) => {
        this.permissions = response.permissions;
        this.swalService.showToast(
          'success',
          response.message ||
            `Se encontraron  ${response.permissions.length} registros`,
          '',
          'text',
          () => {}
        );
      },
      error: (error) => {
        this.permissions = [];
        this.swalService.showToast(
          'error',
          'Error',
          error.error?.message || 'Ocurrió un Error al Obtener los Permisos',
          'text',
          () => {}
        );
      },
    });
  }

  /* Get All Permissions */
  getAllPermissions(): void {
    this.apiServicePermissions.all().subscribe({
      next: (response) => {
        this.permissions = response.permissions;

        this.swalService.showToast(
          'success',
          response.message ||
            `Se encontraron ${response.permissions.length} registros`,
          '',
          'text',
          () => {}
        );
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

    if (this.permissionsModule && this.permissionsModule.view) {
      btns.push({
        class: 'btn-view',
        icon: 'view',
        title: 'Ver',
        action: (element: any) => this.onView(element),
      });
    }

    if (this.permissionsModule && this.permissionsModule.edit) {
      btns.push({
        class: 'btn-edit',
        icon: 'pencil',
        title: 'Editar',
        action: (element: any) => this.onEdit(element),
      });
    }

    if (this.permissionsModule && this.permissionsModule.delete) {
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
      this.swalService.showToast(
        'error',
        'No se pueden editar los permisos del Módulo Principal',
        '',
        'text',
        () => {}
      );
    }
  }

  onDelete(permissions: Permissions): void {
    if (permissions.module !== 'Dashboard') {
      this.swalService.showFireConfirm(
        'warning',
        'Sí, eliminar',
        'Cancelar',
        '¿Estás seguro que deseas eliminar?',
        '¡Esta acción no se puede deshacer!',
        'text',
        () => {
          const obj: Permissions = {
            id: permissions.id,
          };
          this.deletePermissions(obj);
        }
      );
    } else {
      this.swalService.showToast(
        'error',
        'No se pueden eliminar los permisos del Módulo Principal',
        '',
        'text',
        () => {}
      );
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
      type: '',
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
      type: this.selectedPermissions?.type || '',
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
          this.swalService.showFire(
            'success',
            'Permiso Insertado con Éxito',
            '',
            'text',
            () => {
              this.resetFileInput();
              this.getAllPermissions();
            }
          );
        },
        error: (error) => {
          this.swalService.showToast(
            'error',
            'Error',
            'Ocurrió un error al Agregar el Permiso',
            'text',
            () => {}
          );
        },
      });
    } else {
      this.swalService.showToast(
        'warning',
        'Error',
        'Por favor, ingresa correctamente la información.',
        'text',
        () => {}
      );
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
          this.swalService.showToast(
            'success',
            response.message || 'Permiso Modificado con Éxito',
            '',
            'text',
            () => {
              this.resetFileInput();
              this.getAllPermissions();
            }
          );
        },
        error: () => {
          this.swalService.showToast(
            'error',
            'Error',
            'Ocurrió un error al Modificar el Permiso',
            'text',
            () => {}
          );
        },
      });
    } else {
      this.swalService.showToast(
        'warning',
        'Error',
        'Por favor, ingresa correctamente la información.',
        'text',
        () => {}
      );
    }
  }

  deletePermissions(credentials: Permissions): void {
    this.apiServicePermissions.delete(credentials).subscribe({
      next: (response) => {
        this.swalService.showToast(
          'success',
          response.message || 'Permiso Eliminado Correctamente',
          '',
          'text',
          () => {}
        );
        this.getAllPermissions();
      },
      error: () => {
        this.swalService.showToast(
          'error',
          'Error',
          'Ocurrió un Error al Eliminar el Permiso',
          'text',
          () => {}
        );
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

import { Component } from '@angular/core';
import { DatatableComponent } from '../../../datatable/datatable.component';
import { RouterModule } from '@angular/router';
import {
  Clients,
  DeleteRequest,
  ButtonConfig,
  Roles,
  RoutePermissions,
} from 'src/app/models/interfaces';
import { ModalComponentHtml } from '../../../modalHtml/modalhtml.component';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/services/swal.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationsFormService } from 'src/app/utils/form-validations';
import { ApiServiceClients } from '../../../services/api.service.clients';
import { AuthService } from '../../../services/auth.service';
import { ApiServiceRoles } from '../../../services/api.service.roles';
import { IconsModule } from '../../../icons/icons.module';
import { environment } from '../../../../environments/environment';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-client',
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
  templateUrl: './clients.component.html',
  styleUrls: ['../../../../scss/forms.scss', '../../../../scss/buttons.scss'],
})
export class ClientsComponent {
  idClientSearch: string = '';
  showButtonGroupClient: boolean = false;

  clients: Clients[] = [];
  roles: Roles[] = [];
  selectedClient: Clients | null = null;
  clientForm: FormGroup;

  isModalVisible = false;
  titleModal: string = '';
  classModal: string = '';
  error: string | null = null;
  permissions!: RoutePermissions;

  constructor(
    private apiServiceClients: ApiServiceClients,
    private apiServiceRoles: ApiServiceRoles,
    private fb: FormBuilder,
    public validationsFormService: ValidationsFormService,
    private permissionsService: PermissionsService,
    private swalService: SwalService
  ) {
    /* Init Form and Add Validations */
    this.clientForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      tax_id: ['', [Validators.required]],
      tax_system: ['', [Validators.required]],
    });
  }

  /* Buttons Datatable */
  buttons: ButtonConfig[] = [];

  async ngOnInit(): Promise<void> {
    this.permissions = this.permissionsService.getPermissions();
    this.generateButtons();
    this.getAllClients();
    this.getAllRoles();
  }

  /* Get CLient By Id */
  getClientById(filters: { search?: string }): void {
    this.apiServiceClients.filterClients(filters).subscribe({
      next: (response) => {
        this.clients = response.client;
        this.swalService.showToast(
          'success',
          response.message,
          '',
          'text',
          () => {}
        );
      },
      error: (error) => {
        this.clients = [];
        this.swalService.showToast(
          'error',
          'Error',
          error.error?.message || 'Ocurrió un Error al Obtener los Clientes',
          'text',
          () => {}
        );
      },
    });
  }

  /* Get All Clients */
  getAllClients(): void {
    this.apiServiceClients.getAllClients().subscribe({
      next: (response) => {
        this.clients = response;
        this.swalService.showToast(
          'success',
          response.message || `Se encontraron ${response.length} registros`,
          '',
          'text',
          () => {}
        );
      },
      error: (error) => {
        this.clients = [];
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
      columnDef: 'email',
      header: 'E-mail',
      cell: (element: any) => element.email,
    },
    {
      columnDef: 'phone',
      header: 'Télefono',
      cell: (element: any) => element.phone,
    },
    {
      columnDef: 'address',
      header: 'Direccion',
      cell: (element: any) => element.address,
    },
    {
      columnDef: 'tax_id',
      header: 'RFC',
      cell: (element: any) => element.tax_id,
    },
    {
      columnDef: 'tax_system',
      header: 'Régimen fiscal',
      cell: (element: any) => element.tax_system,
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
    this.showModal('add', 'Añadir Cliente');
  }

  onView(client: Clients): void {
    this.showModal('eye', 'Ver Información del Cliente', client);
  }

  onEdit(client: Clients): void {
    this.showModal('edit', 'Editar Cliente', client);
  }

  onDelete(client: Clients): void {
    this.swalService.showFireConfirm(
      'warning',
      'Sí, eliminar',
      'Cancelar',
      '¿Estás seguro que deseas eliminar?',
      '¡Esta acción no se puede deshacer!',
      'text',
      () => {
        const obj: DeleteRequest = {
          id: client.id,
        };
        this.deleteClient(obj);
      }
    );
  }

  /* Show Modal */
  showModal(classModal: string, title: string, client?: Clients): void {
    /* Select Element or Default */
    const defaulClient = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      address: '',
      zip: 0,
      tax_id: '',
      tax_system: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.selectedClient = client ? client : defaulClient;

    /* Inti Form => Show Modal */
    this.clientForm.patchValue({
      id: this.selectedClient?.id || 0,
      name: this.selectedClient?.name || '',
      email: this.selectedClient?.email || '',
      phone: this.selectedClient?.phone || '',
      address: this.selectedClient?.address || '',
      zip: this.selectedClient?.zip || '',
      tax_id: this.selectedClient?.tax_id || '',
      tax_system: this.selectedClient?.tax_system || '',
      created_at: this.selectedClient?.created_at || '',
      updated_at: this.selectedClient?.updated_at || '',
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
        this.editClient();
        break;
      case 'add':
        this.addClient();
        break;
      default:
        break;
    }
  }

  /* Functions */
  addClient(): void {
    if (this.clientForm.valid) {
      let formValue = this.clientForm.value;
      this.apiServiceClients.registerClients(formValue).subscribe({
        next: (response) => {
          this.swalService.showFire(
            'success',
            `<strong>${response.message}</strong>` ||
              '<strong> Cliente Agregado con Éxito </strong>',
            '',
            'text',
            () => {
              this.resetFileInput();
              this.getAllClients();
            }
          );
        },
        error: (error) => {
          this.swalService.showToast(
            'error',
            'Error',
            'Ocurrió un error al Agregar el Cliente, verifica que el Correo y el Télefono no estén registrados en otro Cliente Activo',
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

  editClient(): void {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.value;
      this.apiServiceClients.editClients(formValue).subscribe({
        next: (response) => {
          this.swalService.showFire(
            'success',
            response.message || 'Cliente Modificado con Éxito',
            '',
            'text',
            () => {
              this.resetFileInput();
              this.getAllClients();
            }
          );
        },
        error: () => {
          this.swalService.showToast(
            'error',
            'Error',
            'Ocurrió un error al Modificar el Cliente, verifica que el Correo y el Télefono no estén registrados en otro Cliente Activo',
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

  deleteClient(credentials: DeleteRequest): void {
    this.apiServiceClients.deleteClients(credentials).subscribe({
      next: (response) => {
        this.swalService.showToast(
          'success',
          response.message || 'Cliente Eliminado Correctamente',
          '',
          'text',
          () => {}
        );
        this.getAllClients();
      },
      error: () => {
        this.swalService.showToast(
          'error',
          'Error',
          'Ocurrió un Error al Eliminar el Cliente',
          'text',
          () => {}
        );
      },
    });
  }

  /* Search Employee */
  searchClient(): void {
    if (this.idClientSearch) {
      const isNumber = (value: string | number) => /^\d+$/.test(String(value));
      const isValid = isNumber(this.idClientSearch);
      let data = null;

      if (isValid) {
        data = {
          search: this.idClientSearch,
        };
      } else {
        data = {
          search: this.idClientSearch.toString(),
        };
      }
      this.getClientById(data);
    } else {
      this.getAllClients();
    }
  }

  /* Reset Input File */
  resetFileInput(): void {
    this.clientForm.reset();
  }
}

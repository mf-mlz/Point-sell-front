/* Login User */
export interface loginUser {
  id: number;
  name: string;
  role_name: string;
}

export interface loginUserEncrypt {
  data: string;
}

/* User Payload */
export interface userPayload {
  id: number;
  name: string;
  email: string;
  phone: string;
  role_id: number;
  role_name: string;
  iat: number;
  exp: number;
}

/* Products Interfaces */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  code: string;
  category: string;
  stock: number;
  photo: string;
  key_sat: string;
  expiration_date: string;
  isGranular: boolean;
}

export interface Category {
  category: string;
}

export interface KeySat {
  clave: string;
  descripcion: string;
}

/* Sales */
export interface SaleDate {
  dateBefore: string;
  dateAfter: string;
}

export interface Sale {
  id: number;
  date: string;
  totalAmount: number;
  payment: number;
  dataPayment: string;
  customerId: number;
  employeesId: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SaleInfoComplete {
  id: number;
  payment: number;
  customerId: number;
  employeesId: number;
  status: string;
  date: string;
  folio: string;
  totalAmount: number;
  payment_status: string;
  rejection_reason: string;
  typePayment: string;
  dataPayment: string;
  nameClient: string;
  emailClient: string;
  taxIdClient: string;
  taxSystemClient: number;
  nameEmployee: string;
  emailEmployee: string;
  id_invoice: string;
  status_invoice: string;
}

export interface TransactionSale {
  date: string;
  customerId?: number;
  payment: number;
  employeesId: number;
  status?: number;
  typePayment: string;
  dataPayment?: string;
  total: string;
  products: ProductObjSale[];
  amount?: number;
  changeAmount?: number;
}

export interface DataCard {
  card_number: number;
  holder_name: string;
  expiration_year: number;
  expiration_month: number;
  cvv2: string;
}

export interface PaymentObj {
  token: string;
  deviceSessionId: string;
  amount: number;
  description: string;
}

/* Open Pay */
export interface OpenPayPayment {
  id_order: number;
  token: string;
  amount: number;
  description: string;
  deviceSessionId: string;
  customer: {
    name: string;
    lastName: string;
    email: string;
  };
}

export interface customerOpenPay {
  name: string;
  lastName: string;
  email: string;
}

/* Forms Payment */
export interface PaymentForm {
  id: number;
  descripcion: string;
  created_at: Date;
  updated_at: Date;
  required_data: Boolean;
}

/* Datatable */
export interface ButtonConfig {
  class: string;
  icon: string;
  title: string;
  action: (element: any) => void;
}

/* Employees */
export interface Employee {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: number;
  address: string;
  status: string;
  role_id: number;
  created_at?: string;
  updated_at?: string;
  role?: string;
}

export interface EmployeeFilter {
  id?: number;
  name?: string;
}

/* Clients */
export interface Clients {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  zip: number;
  tax_id: string;
  tax_system: number;
  created_at: Date;
  updated_at: Date;
}

/* Sale Product */
export interface SaleProductDescription {
  quantity: number;
  price: number;
  key_sat: string;
  descripcion: string;
  descriptionSat: string;
}

/* Invoices */

export interface InvoiceSendEmail {
  invoiceId: string;
  emails: string;
}

export interface Invoice {
  customer: Number;
  id_sale: Number;
  id_employee: Number;
}

export interface InvoiceDownload {
  id_invoice: string;
}

export interface CancelInvoice {
  id_invoice: string;
  id_employee: number;
  motive: string;
}

export interface InvoiceList {
  id: number;
  id_sale: number;
  id_invoice: string;
  id_employee: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SaleInvoice {
  id: number;
  id_sale: number;
  id_invoice: string;
  id_employee: number;
  id_employee_cancel: number;
  status: string;
  status_invoice: string;
  motive: string;
  created_at: Date;
  updated_at: Date;
  employee_name: string;
  employee_cancel_name: string;
  folio: string;
  email_client: string;
}

/* Delete Interface */
export interface DeleteRequest {
  id: number;
}

/* Rol */
export interface Rol {
  id: number;
  name: string;
}

/* Products */
export interface AddProductSale {
  id: number;
  quantity: number;
  name: string;
  price: number;
  code: string;
  isGranular: boolean;
  photo: string;
}

export interface ProductFilterData {
  id?: string;
  name?: string;
  category?: string;
  stock?: string;
  code?: string;
}

export interface ProductFilter {
  id: number;
  name: string;
  quantity: number;
  description: string;
  key_sat: string;
  price: number;
  category: string;
  stock: number;
  photo: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  code: string;
  isGranular: boolean;
}

export interface SimpleProductSwal {
  id: number;
  name: string;
}

export interface ProductObjSale {
  id: number;
  quantity: number;
  name: string;
  price: number;
  code: string;
}

/* Errors */
export interface OpenPayError {
  data?: {
    message?: string;
    description?: string;
  };
}

/* Roles */
export interface Roles {
  id: number;
  name: string;
}

/* Permissions */
export interface Permissions {
  id?: number;
  role_id?: string;
  module?: string;
  permissions?: string;
  name_rol?: string;
  type?: string;
}

export interface NavItem {
  name: string;
  url: string;
  iconComponent: {
    name: string;
  };
  badge: {
    color: string;
    text: string;
  };
  children?: NavItem[];
}

export interface objPermissionsByRole {
  data: string;
}

export interface RoutePermissions {
  add: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
  access: boolean;
}

/* Modules */
export interface ModulesPermissions {
  module: string;
}

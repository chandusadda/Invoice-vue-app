/**
 * InvoiceInterface will hold the complete invoice interface
 */
export interface InvoiceInterface {
  id: string;
  paymentDue: string;
  clientName: string;
  total: number;
  status: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  items: ItemsList[];
  paymentTerms?: number;
  description?: string;
  createdAt?: string;
}

/**
 * Address will hold the Address of invoice interface
 */
export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

/**
 * ItemsList will hold the Items list of invoice interface
 */
export interface ItemsList {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

/**
 * Error will hold the error interface
 */
export interface Error {
  error: boolean;
  errorMsg: string;
}

/**
 * InvoiceProps will hold the InvoiceProps interface of a component
 */
export interface InvoiceProps {
  invoiceData: InvoiceInterface;
  id: string | string[];
  showModal: boolean;
  showDeleteModal: boolean;
}

/**
 * InvoiceProps will hold the InvoiceProps interface of a component
 */
export interface InvoivesCompProps {
  invoicesData: [];
  invoicesLoading: boolean;
  invoicesTotalText: string;
  showModal: boolean;
}

export interface SyntheticEventTarget<T> {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  dispatchEvent(evt: Event): boolean;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
  value: T;
}
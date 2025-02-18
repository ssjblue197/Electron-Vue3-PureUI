import {
  ProductSize,
  ProductColor,
  Product,
  ProductAttribute,
} from '@/types/product';

import type { RowData as Invoice } from '@/modules/payment/types';

import type { Store } from '@/types/store';

import type { FilterParams } from '@/types/filter';

export interface OrderAddress {
  id?: number;
  order_id?: number;
  name?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface Filter extends FilterParams {
  key?: string;
  key_search?: string;
  order_status?: string; //value: seller
  order_date_start?: string; //YYYY-MM-DD
  order_date_end?: string; //YYYY-MM-DD
  sku?: string;
  is_test?: number | string;
  is_support_login?: number; // 0 | 1
  order_type?: (string | number)[];
  payment_status?: string;
  action?: string; // export | empty string
  search?: string;
}

export interface RowData {
  key?: string;
  external_number?: string;
  order_status?: string;
  payment_status?: string;
  created_at?: string; // ISO date string
  amount_paid?: number | null;
  shipping_calculate?: string;
  order_date?: string; // ISO date string
  encode_id?: string;
  is_test?: number;
  shipment_id?: number | null;
  store_id?: number;
  is_fba_order?: number;
  order_type?: number;
  quantity?: string;
  address?: OrderAddress;
  shipment_default?: Shipment;
  store?: Store;
}

export interface ShippingCarrier {
  id?: number;
  code?: string;
  name?: string;
  tracking_url?: string;
}

export interface Shipment {
  id?: number;
  order_id?: number;
  ship_date?: string;
  tracking_number?: string;
  carrier_code?: string;
  service_code?: string;
  refund_status?: string | null;
  label_url?: string;
  url?: string;
  shipping_carrier?: ShippingCarrier;
  shipping_carrier_service?: any | null; // Replace `any` with the correct type if known
}

export interface OrderStatus {
  title?: string;
  value?: string;
  color?: string;
}

export interface PaymentStatus extends OrderStatus {}

export interface Option {
  name?: string;
  value?: string;
}

export interface PrintSizeType {
  code?: number;
  name?: string;
}

export interface OrderItemImage {
  id?: number;
  order_item_id?: number;
  image_url?: string;
  image_width?: number;
  image_height?: number;
  print_side?: string;
  print_size_type?: PrintSizeType;
}
export interface OrderItem {
  id?: number;
  name?: string;
  order_id?: number;
  product_sku?: string;
  sku?: string;
  quantity?: number;
  product_id?: number;
  options?: Option[];
  unit_price?: string;
  blank_price?: string;
  handling_fee?: string;
  product_style_sku?: string;
  product_color_sku?: string;
  product_size_sku?: string;
  images?: OrderItemImage[];
  get_type_product?: Partial<ProductAttribute>;
  product: Product;
  product_color: ProductSize;
  product_size: ProductColor;
}

export interface PeakShippingFee {
  id?: number;
  type?: string;
  value?: string;
  order_id?: number;
  surcharge_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface OrderSurChargeFee {
  id?: string;
  type?: string;
  value?: number;
  order_id?: number;
}

export interface OrderInsert {
  status?: boolean;
  url?: string;
  message?: string;
  type?: string;
  size?: string;
  file_id?: number;
  unit_price?: string;
}

export interface Surcharge {
  name?: string;
  total?: number;
}

export interface Order {
  id?: number;
  address?: OrderAddress;
  return_address?: OrderAddress[];
  store_return_address?: OrderAddress[];
  warehouse?: OrderAddress;
  order_number?: string;
  external_id?: string | null;
  external_key?: string | null;
  external_number?: string;
  order_status?: string;
  warehouse_id?: number;
  account_id?: number;
  store_id?: number;
  is_test?: number;
  order_type?: number;
  encode_id?: string;
  customer_email?: string | null;
  order_total?: string;
  amount_paid?: number | null;
  tax_amount?: string | null;
  shipping_amount?: string | null;
  customer_note?: string | null;
  internal_note?: string | null;
  is_gift?: number;
  gift_message?: string;
  payment_method?: string | null;
  shipping_method?: string | null;
  source?: string;
  created_at?: string;
  updated_at?: string;
  external_created_at?: string | null;
  tag?: string | null;
  is_eps?: number;
  order_date?: string;
  order_time?: string;
  is_xqc?: number;
  barcode_printed_status?: number;
  order_printed_status?: number;
  order_printed_at?: string | null;
  barcode_printed_at?: string | null;
  print_file_created_at?: string | null;
  print_file_status?: number;
  order_pulled_status?: number;
  order_pulled_at?: string | null;
  order_staged_status?: number;
  order_staged_at?: string | null;
  skip_alert_default?: number;
  order_pretreated_at?: string | null;
  order_pretreated_status?: number;
  order_qc_status?: number;
  order_qc_at?: string | null;
  order_folding_at?: string | null;
  order_folding_status?: number;
  order_shipping_status?: number;
  order_shipped_at?: string | null;
  order_production_at?: string | null;
  order_quantity?: number;
  shipment_id?: string | null;
  calculated_at?: string;
  merchant_name?: string | null;
  cancelled_at?: string | null;
  rejected_at?: string | null;
  rejected_reason?: string | null;
  is_manual?: number;
  is_shipment_create_error?: number;
  manual_process_at?: string | null;
  employee_manual_id?: string | null;
  shipping_calculate?: string;
  is_fba_order?: number;
  fba_shipping_label?: string | null;
  fba_item_label?: string | null;
  is_create_manual?: number;
  ioss_number?: string | null;
  tax_id_type?: string | null;
  production_status?: string | null;
  is_error?: number;
  plastic_bag?: number;
  items?: OrderItem[];
  key?: string;
  order_insert?: OrderInsert[];
  order_surcharge_fee?: OrderSurChargeFee[];
  peak_shipping_fee?: PeakShippingFee;
  shipment?: Shipment[];
  newest_paynow_invoice?: Invoice;
  surcharge_fee?: Surcharge[];
  quantity?: number | string;
  store?: Store;
  payment_status?: string;
  refund_value?: string[];
  refund_amount?: number;
}

export interface SLAOrderStatisticItem {
  average?: string | number;
  item_count?: number;
  product_type?: string;
  total_orders_sum?: string | number;
  total_orders_sum_yesterday?: string | number;
}

export interface SupportForm {
  issue?: string;
  solution?: string;
  email?: string;
  desc?: string;
  uploadedFiles?: Array<File>;
  files?: Array<File>;
  type?: number | string;
  store_id?: number;
  order_id?: number;
  order_item_id?: string;
}

export interface RowDataImport {
  id?: number;
  store_id?: number;
  file_name?: string;
  order_total?: number;
  order_imported?: number;
  order_failed?: number;
  file_imported?: string;
  file_failed?: string;
  created_at?: string;
  updated_at?: string;
}

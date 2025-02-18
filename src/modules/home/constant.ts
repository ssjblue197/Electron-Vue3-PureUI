import { html } from 'lit';
import type {
  OrderStatus,
  RowData,
} from '@/modules/home/types';
import type { OptionItem } from '@/types/common';

export const STATUS_LIST: OrderStatus[] = [
  {
    title: 'All',
    value: '',
    color: '#f87171',
  },
  {
    title: 'New order',
    value: 'new_order',
    color: '#5710FDFF',
  },
  {
    title: 'In production',
    value: 'in_production',
    color: '#0077FF',
  },
  // {
  //   title: 'Manual process',
  //   value: 'manual_process',
  //   color: '#fb923c',
  // },
  {
    title: 'Shipped',
    value: 'shipped',
    color: '#16A34A',
  },
  {
    title: 'Cancelled',
    value: 'cancelled',
    color: '#FF0000FF',
  },
  {
    title: 'Rejected',
    value: 'rejected',
    color: '#FF0000FF',
  },
  {
    title: 'On hold',
    value: 'on_hold',
    color: '#D97706',
  },
  {
    title: 'Draft',
    value: 'draft',
    color: '#52525B',
  },
  {
    title: 'In production cancelled',
    value: 'in_production_cancelled',
    color: '#FF0000FF',
  },
  {
    title: 'Test',
    value: 'test',
    color: '#E25164',
  },
];

export const PAYMENT_STATUS_LIST: OrderStatus[] = [
  {
    title: 'All status',
    value: '',
    color: '#f87171',
  },
  {
    title: 'Pending',
    value: 'pending',
    color: '#B54708',
  },
  {
    title: 'Paid',
    value: 'paid',
    color: '#16A34A',
  },
  {
    title: 'Refunded',
    value: 'refunded',
    color: '#175CD3',
  },
  {
    title: 'Partial refunded',
    value: 'partial_refunded',
    color: '#175CD3',
  },
];

export const ORDER_TYPE_LIST: OptionItem[] = [
  {
    title: 'Tiktok order',
    value: 6,
  },
  {
    title: 'Label order',
    value: 5,
  },
  {
    title: 'Licensed order',
    value: 7,
  },
];

export const ISSUE_LIST: OptionItem[] = [
  {
    value: '1',
    title: 'Faded/Coloring issue',
  },
  {
    value: '2',
    title: 'Missing print',
  },
  {
    value: '3',
    title: 'Wrong print',
  },
  {
    value: '4',
    title: 'Wrong garment',
  },
  {
    value: '5',
    title: 'Wrong items sent',
  },
  {
    value: '6',
    title: 'Washed-out garment',
  },
  {
    value: '7',
    title: 'Other',
  },
];

export const ORDER_INSERT_TYPE_LIST: (OptionItem & {
  variant?: string;
})[] = [
  {
    title: 'Packing Slip',
    value: 'packing_slip',
    variant: 'primary',
  },
  {
    title: 'Thank You Card',
    value: 'thankyou_card',
    variant: 'success',
  },
  {
    title: 'Gift Message',
    value: 'gift_message',
    variant: 'danger',
  },
];

export const orderStatusTag = (row: RowData) => {
  const color = STATUS_LIST?.find(
    (s: OrderStatus) => s.value === row?.order_status,
  )?.color;
  const name = STATUS_LIST?.find(
    (s: OrderStatus) => s.value === row?.order_status,
  )?.title;

  const orderStatusTag = html`
    <style>
      .status-container {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
      }
      .${`custom-${row?.key}`}::part(base) {
        background-color: color-mix(
          in srgb,
          var(--p-color-neutral-0) 100%,
          ${color} 10%
        );
        color: ${color};
        border-color: color-mix(
          in srgb,
          var(--p-color-neutral-0) 100%,
          ${color} 40%
        );
      }
    </style>
    <p-tag
      size="small"
      variant="primary"
      class="custom-${row?.key}"
    >
      ${name}
    </p-tag>
  `;

  const testTag = html`
      <p-tag size="small" variant="danger"> Test </p-tag>
    </div>
  `;

  return html`
    <div class="status-container">
      ${orderStatusTag} ${row?.is_test ? testTag : ''}
    </div>
  `;
};

export const paymentStatusTag = (row: RowData) => {
  const color = PAYMENT_STATUS_LIST?.find(
    (s: OrderStatus) => s.value === row?.payment_status,
  )?.color;
  const name = PAYMENT_STATUS_LIST?.find(
    (s: OrderStatus) => s.value === row?.payment_status,
  )?.title;

  const paymentStatusTag = html`
    <style>
      .payment-status-container {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
      }
      .${`payment-custom-${row?.key}`}::part(base) {
        background-color: color-mix(
          in srgb,
          var(--p-color-neutral-0) 100%,
          ${color} 10%
        );
        color: ${color};
        border-color: color-mix(
          in srgb,
          var(--p-color-neutral-0) 100%,
          ${color} 40%
        );
      }
    </style>
    <p-tag
      size="small"
      variant="primary"
      class="payment-custom-${row?.key}"
    >
      ${name}
    </p-tag>
  `;

  return html`
    <div class="payment-status-container">
      ${row?.payment_status ? paymentStatusTag : null}
    </div>
  `;
};

export const formatDataExport = (data: RowData[]) => {
  const cleanedString = (inputString: string) =>
    inputString.replace(/[,\t]/g, '');
  const cleanExternalNumber = (input: string) =>
    input.replace(/['"]/g, ''); // xóa ký tự đặc biệt gây lỗi excel
  return data.map((item) => {
    const cleanedName = item.address?.name
      ? cleanedString(item.address.name)
      : '';
    return {
      'Order Number': item.encode_id,
      'Ref Number': cleanExternalNumber(
        String(item?.external_number),
      ),
      'Tracking Number': item.shipment_default
        ? item.shipment_default?.tracking_number
        : '',
      Recipient: cleanedName,
      'Order Status': item.order_status
        ? STATUS_LIST.find(
            (s) => s.value === item.order_status,
          )?.title
        : '',
      Quantity: item.quantity ?? 0,
      'Order Date': item.created_at,
      'Product Price':
        Number(item.amount_paid) !== 0
          ? Number(item.amount_paid)
          : 'Calculating',
      'Shipping Price':
        Number(item.shipping_calculate) !== 0
          ? Number(item.shipping_calculate)
          : 'Calculating',
    };
  });
};

export const openNewWindow = (url?: string) => {
  if (!url) return;
  window.open(url, '_blank');
};

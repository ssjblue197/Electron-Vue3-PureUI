<template>
  <div class="relative flex w-full flex-col gap-md">
    <div
      class="relative flex w-full items-center justify-between"
    >
      <span
        class="text-sm font-semibold text-gray-900 md:text-base"
      >
        Order items
      </span>
      <span
        class="text-sm font-semibold text-gray-900 md:text-base"
      >
        Total quantity:
        {{ props.data?.quantity || 0 }}
      </span>
    </div>
    <div class="relative w-full">
      <div class="relative w-full">
        <p-table
          :options="local.options"
          .loading="props.loading"
          :data="props.data?.items || []"
        >
        </p-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type {
  Order,
  OrderItem,
} from '@/modules/home/types';
import { html } from 'lit';
import {
  SKUColumn,
  PrintAreColumn,
} from '@/modules/claim/components/claimDetailModal';

interface Props {
  data?: Order;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
});

interface Local {
  loading: boolean;
  options: any;
}

const local = reactive<Local>({
  loading: false,
  options: {
    paginate: false,
    hideFooter: true,
    columns: [
      {
        field: 'product_sku',
        id: 'product_sku',
        headerName: 'SKU',
        minWidth: '260px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: function (row: OrderItem) {
          return SKUColumn(row);
        },
      },
      {
        field: 'images',
        id: 'images',
        headerName: 'Print area',
        minWidth: '200px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: function (row: OrderItem): any {
          return PrintAreColumn(
            row,
            props.data?.order_date,
          );
        },
      },
      {
        field: 'quantity',
        id: 'quantity',
        headerName: 'Quantity',
        minWidth: '120px',
      },
      {
        field: 'unit_price',
        id: 'unit_price',
        headerName: 'Price',
        minWidth: '120px',

        render: (row: OrderItem) =>
          html` <p-format-number
            type="currency"
            currency="USD"
            .value=${(Number(row?.unit_price) -
              Number(row?.handling_fee || 0)) *
            Number(row?.quantity)}
            lang="en-US"
          ></p-format-number>`,
      },
    ],
  },
});
</script>

<style scoped>
p-table::part(table-loading),
p-table::part(table-empty) {
  min-height: 70px !important;
}
</style>

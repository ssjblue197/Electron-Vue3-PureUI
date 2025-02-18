<template>
  <p-dialog
    :open="props.open"
    @p-after-hide="emits('close')"
  >
    <div
      class="flex w-full items-center gap-xl"
      slot="label"
    >
      <div
        class="flex aspect-square w-12 items-center justify-center rounded-lg border border-gray-200 text-title-xs text-gray-700 shadow-xs"
      >
        <p-icon
          name="life-buoy-02"
          library="custom"
        ></p-icon>
      </div>
      <div class="flex flex-1 flex-col gap-xs">
        <span class="text-lg font-semibold text-gray-900">
          Customer support
        </span>
        <span class="text-sm font-normal text-gray-600">
          Step: {{ local.currentStep }}/2
          <span v-if="local.selectedItems.length > 0">
            - {{ local.selectedItems.length }}
            {{
              local.selectedItems.length > 1
                ? 'items'
                : 'item'
            }}
            selected
          </span>
        </span>
      </div>
    </div>
    <div
      class="relative flex w-full flex-col items-start divide-y divide-gray-200"
    >
      <template v-if="local.currentStep === 1">
        <div
          class="relative flex w-full flex-col items-start gap-xl pb-2xl"
        >
          <span class="text-sm font-medium text-gray-700">
            What can we help you with today*
          </span>
          <p-button-group label="Alignment" class="w-full">
            <p-button
              @click="selectReason(1)"
              class="flex-1"
            >
              <span
                class="absolute h-2 w-2 rounded-full bg-[#17B26A]"
                slot="prefix"
                v-show="local.selectedReason === 1"
              >
              </span>
              My order is lost in transit</p-button
            >
            <p-button
              @click="selectReason(2)"
              class="flex-1"
            >
              <span
                class="absolute h-2 w-2 rounded-full bg-[#17B26A]"
                slot="prefix"
                v-show="local.selectedReason === 2"
              >
              </span>
              My item(s) need some care</p-button
            >
          </p-button-group>
        </div>
        <div
          class="relative flex w-full flex-col items-start gap-xl pt-2xl"
          v-if="local.selectedReason === 2"
        >
          <span class="text-sm font-medium text-gray-700">
            Select item(s) affected*
          </span>
          <div class="relative w-full">
            <p-table
              :options="local.options"
              :loading="local.loading"
              :data="local.selectedOrder.items || []"
              .selectedRows="local.selectedItems"
              @p-table-row-select="handleRowSelect"
            >
            </p-table>
          </div>
        </div>
      </template>
      <SupportForm
        :selectedReason="local.selectedReason"
        @submit="handleSubmit"
        v-else
      />
    </div>
    <div
      class="flex w-full items-center gap-lg"
      slot="footer"
    >
      <p-button
        class="flex-1"
        @click="handleBack"
        :loading="local.loading"
      >
        {{ local.currentStep === 1 ? 'Cancel' : 'Back' }}
      </p-button>
      <p-button
        :loading="local.loading"
        class="flex-1"
        variant="primary"
        @click="handleNavigate"
        :disabled="
          local.currentStep === 1 &&
          local.selectedReason === 2 &&
          local.selectedItems.length == 0
        "
        >{{
          local.currentStep === 1 ? 'Next' : 'Submit'
        }}</p-button
      >
    </div>
  </p-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { RowData } from '@/modules/home/types';
import type {
  OrderItem,
  Order,
  SupportForm as SupportFormType,
} from '@/modules/home/types';
import { html } from 'lit';
import {
  SKUColumn,
  PrintAreColumn,
} from '@/modules/claim/components/claimDetailModal';
import { useOrderStore } from '@/modules/home/store';
import { useAuthStore } from '@/modules/auth/store';
import SupportForm from '@/modules/home/components/SupportForm.vue';
import EventBus from '@/utils/eventbus';

const orderStore = useOrderStore();
const authStore = useAuthStore();

interface Props {
  data?: RowData;
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  open: false,
});

const emits = defineEmits(['close']);

interface Local {
  loading: boolean;
  options: any;
  selectedReason: 1 | 2;
  selectedOrder: Order;
  selectedItems: OrderItem[];
  currentStep: 1 | 2;
}

const local = reactive<Local>({
  loading: false,
  options: {
    paginate: false,
    hideFooter: true,
    selectable: true,
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
            local.selectedOrder?.order_date,
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
            .value=${Number(row?.unit_price) *
            Number(row?.quantity)}
            lang="en-US"
          ></p-format-number>`,
      },
    ],
  },
  selectedReason: 1,
  selectedOrder: {},
  selectedItems: [],
  currentStep: 1,
});

const loadOrderDetail = async () => {
  try {
    local.loading = true;
    const data = await orderStore.detail({
      key: props.data?.key,
      // is_support_login: authStore.isSupportLogin
      //   ? 1
      //   : undefined,
    });
    local.selectedOrder = data || {};
    console.log(local.selectedOrder);
  } catch (error) {
  } finally {
    local.loading = false;
  }
};

const selectReason = (reason: 1 | 2) => {
  local.selectedReason = reason;
  if (reason === 2) {
    loadOrderDetail();
  }
};

const handleRowSelect = (
  e: Event & {
    detail: {
      selection: OrderItem[];
    };
  },
) => {
  local.selectedItems = e.detail?.selection || [];
};

const handleBack = () => {
  if (local.currentStep === 1) {
    emits('close');
  } else {
    local.currentStep = 1;
  }
};

const handleNavigate = () => {
  if (local.currentStep === 1) {
    local.currentStep = 2;
  } else {
    EventBus.$emit('submit-support-form');
  }
};

const handleSubmit = async (data: SupportFormType) => {
  try {
    local.loading = true;
    const payload = {
      issue: data?.issue,
      solution: data?.solution,
      email: data?.email,
      desc: data?.desc,
      files: data?.uploadedFiles,
      order_id: props.data?.address?.order_id,
      type: local.selectedReason,
      store_id: props.data?.store_id,
      order_item_id: local.selectedItems
        .map((item) => Number(item.id))
        ?.join(','),
    };
    await orderStore.support(payload);
    emits('close');
  } catch (error) {
  } finally {
    local.loading = false;
  }
};
</script>

<style scoped lang="scss">
p-dialog::part(header) {
  border-bottom: 1px solid var(--p-color-gray-200);
}
p-dialog::part(footer) {
  border-top: 1px solid var(--p-color-gray-200);
}
p-dialog::part(panel) {
  width: auto;
  max-width: 90vw;
  min-width: 40vw;
}

p-table::part(table-loading),
p-table::part(table-empty) {
  min-height: 70px !important;
}
</style>

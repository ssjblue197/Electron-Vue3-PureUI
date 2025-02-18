<template>
  <p-dialog
    :open="props.open"
    @p-after-hide="emits('close')"
    @p-after-show="loadOrderDetail"
  >
    <Header slot="label" :data="local.selectedOrder" />
    <div
      class="relative flex w-full flex-col items-start gap-2xl md:flex-row md:gap-3xl"
    >
      <div
        class="relative flex w-full flex-col gap-2xl md:basis-2/3 md:gap-3xl"
      >
        <OrderSummary
          :data="local.selectedOrder"
          :loading="local.loading"
          @close-refresh="emits('close-refresh')"
        />

        <OrderItems
          :data="local.selectedOrder"
          :loading="local.loading"
        />
      </div>
      <div
        class="relative flex w-full flex-col gap-2xl md:basis-1/3 md:gap-3xl lg:min-w-[300px]"
      >
        <OrderShipping
          :data="local.selectedOrder"
          :loading="local.loading"
          @refresh="loadOrderDetail"
        />
        <OrderTaxIdentify
          :data="local.selectedOrder"
          :loading="local.loading"
        />
        <OrderShipments
          :data="local.selectedOrder"
          :loading="local.loading"
        />
        <OrderBilling
          :data="local.selectedOrder"
          :loading="local.loading"
        />
      </div>
    </div>
    <p-button
      slot="footer"
      variant="primary"
      v-if="
        ['draft']?.includes(
          String(
            local.selectedOrder?.order_status,
          ).toLocaleLowerCase(),
        )
      "
      :loading="local.processing"
      :disabled="local.processing"
      @click="changeToNewOrder"
      >Submit order</p-button
    >
  </p-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { RowData } from '@/modules/home/types';
import type { Order } from '@/modules/home/types';
import { useOrderStore } from '@/modules/home/store';
import { useAuthStore } from '@/modules/auth/store';
import Header from '@/modules/home/components/OrderDetailModal/Header.vue';
import OrderSummary from '@/modules/home/components/OrderDetailModal/OrderSummary.vue';
import OrderItems from '@/modules/home/components/OrderDetailModal/OrderItems.vue';
import OrderShipping from '@/modules/home/components/OrderDetailModal/OrderShipping.vue';
import OrderTaxIdentify from '@/modules/home/components/OrderDetailModal/OrderTaxIdentify.vue';
import OrderShipments from '@/modules/home/components/OrderDetailModal/OrderShipments.vue';
import OrderBilling from '@/modules/home/components/OrderDetailModal/OrderBilling.vue';

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

const emits = defineEmits(['close', 'close-refresh']);

interface Local {
  loading: boolean;
  selectedOrder: Order;
  processing?: boolean;
}

const local = reactive<Local>({
  loading: false,
  selectedOrder: {},
  processing: false,
});

const loadOrderDetail = async () => {
  try {
    local.loading = true;
    const data = await orderStore.detail({
      key: props.data?.encode_id,
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

const changeToNewOrder = async () => {
  try {
    local.processing = true;
    await orderStore.updateStatus({
      encode_id: String(props.data?.encode_id),
    });
    setTimeout(() => {
      emits('close-refresh');
    }, 500);
  } catch (error) {
  } finally {
    local.processing = false;
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
  min-width: 55vw;
}

.download_menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background-color: var(--p-color-neutral-0);
  border-radius: 0.5rem;
  border: 1px solid var(--p-color-neutral-200);
  box-shadow:
    0px 4px 6px -2px #10182808,
    0px 12px 16px -4px #10182814;
}
</style>

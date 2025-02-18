<template>
  <div class="relative flex w-full flex-col gap-md">
    <div
      class="relative flex w-full items-center justify-between"
    >
      <span
        class="text-sm font-semibold text-gray-900 md:text-base"
      >
        Shipping method
      </span>
    </div>
    <div
      class="relative flex w-full flex-col items-start gap-lg rounded-xl border border-gray-200 p-lg md:p-xl"
    >
      <div
        class="relative flex w-full items-center justify-between gap-sm"
      >
        <span class="text-sm font-medium text-gray-600">
          Shipping method
        </span>

        <div
          class="h-6 w-24 animate-pulse rounded-lg bg-gray-100"
          v-if="
            props.loading || !props.data?.shipping_method
          "
        ></div>
        <div
          :class="
            twMerge(
              'flex items-center gap-md rounded-lg border border-gray-300 p-1 pl-2 shadow-xs',
              showUpgradeBtn ? '' : 'pr-2',
            )
          "
          v-else
        >
          <div
            class="aspect-square w-[6px] rounded-full bg-success-500"
          ></div>
          <span
            class="text-xs font-medium text-gray-700"
            v-if="
              props.data?.shipping_method &&
              shippingMethodName.length <= 18
            "
          >
            {{ shippingMethodName }}
          </span>
          <p-tooltip
            :content="shippingMethodName"
            v-if="
              props.data?.shipping_method &&
              shippingMethodName.length > 18
            "
            @p-after-show="
              (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
              }
            "
            @p-after-hide="
              (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
              }
            "
          >
            <span class="text-xs font-medium text-gray-700">
              {{ shippingMethodName.slice(0, 18) + '...' }}
            </span>
          </p-tooltip>
          <p-dropdown
            v-if="showUpgradeBtn"
            ref="upgradeBtn"
            behavior="click"
            placement="bottom-end"
            skidding="4"
            distance="6"
            @p-after-show="
              (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
              }
            "
            @p-after-hide="
              (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
              }
            "
          >
            <span slot="trigger" caret>
              <div
                class="flex cursor-pointer select-none items-center gap-xs rounded-sm border border-gray-300 px-1.5 text-xs font-medium text-gray-700 shadow-xs active:opacity-90 active:shadow-none"
              >
                Upgrade
                <p-icon
                  name="arrows-up"
                  library="custom"
                  class="!text-gray-500"
                ></p-icon>
              </div>
            </span>

            <p-menu class="min-w-[160px] border">
              <p-menu-item
                v-for="s in shippingMethodListAvailable"
                :key="s.value"
                type="checkbox"
                :checked="
                  local.selectedNewShippingMethod?.value ===
                  s?.value
                "
                @click="
                  (e: Event) => {
                    e.preventDefault();
                    e.stopPropagation();
                    local.selectedNewShippingMethod = s;
                    upgradeBtn?.hide();
                    showConfirmModal();
                  }
                "
                ><span
                  class="text-base font-medium text-gray-900"
                  >{{ s?.title }}</span
                ></p-menu-item
              >
            </p-menu>
          </p-dropdown>
        </div>
      </div>
    </div>
    <p-dialog
      label=""
      ref="errorModal"
      @p-after-hide="
        (e: Event) => {
          e?.preventDefault();
          e?.stopPropagation();
        }
      "
      @p-after-show="
        (e: Event) => {
          e?.preventDefault();
          e?.stopPropagation();
        }
      "
    >
      <div slot="label">
        <div
          class="relative ml-1 mt-1 aspect-square w-12 rounded-full bg-error-50 text-error-600"
        >
          <p-icon
            name="alert-triangle"
            library="custom"
            class="center"
          ></p-icon>
        </div>
      </div>
      <div
        class="relative flex w-full max-w-[350px] flex-col gap-xs pb-6"
      >
        <div class="text-lg font-semibold text-gray-900">
          Failed to upgrade the shipping method due to order
          status change
        </div>
        <div class="text-sm font-normal text-gray-600">
          You can only change the shipping method if the
          order is in one of the following statuses:
          <ul class="mt-4 list-disc pl-6">
            <li>New order</li>
            <li>In production</li>
            <li>Draft</li>
          </ul>
        </div>
      </div>
      <p-button
        slot="footer"
        variant="default"
        @click.stop="cancelErrorModal"
        class="w-full"
        >I got it</p-button
      >
    </p-dialog>
    <p-dialog
      label=""
      ref="confirmModal"
      @p-after-hide="
        (e: Event) => {
          e?.preventDefault();
          e?.stopPropagation();
          local.selectedNewShippingMethod = undefined;
        }
      "
      @p-after-show="
        (e: Event) => {
          e?.preventDefault();
          e?.stopPropagation();
        }
      "
    >
      <div slot="label">
        <div
          class="relative ml-1 mt-1 aspect-square w-12 rounded-full bg-warning-50 text-warning-600"
        >
          <p-icon
            name="alert-triangle"
            library="custom"
            class="center"
          ></p-icon>
        </div>
      </div>
      <div
        class="relative flex w-full max-w-[350px] flex-col gap-xs pb-6"
      >
        <div class="text-lg font-semibold text-gray-900">
          Are you sure you want to upgrade your shipping
          method?
        </div>
        <div class="text-sm font-normal text-gray-600">
          Here's what to know after upgrading:
          <ul class="mt-4 list-disc pl-6">
            <li>This change will impact the order cost</li>
            <li>
              Downgrading will not be available after
              confirmation.
            </li>
          </ul>
        </div>
      </div>
      <div class="relative flex w-full items-center gap-lg">
        <p-button
          variant="default"
          @click.stop="cancelConfirmModal"
          class="w-full"
          :loading="local.processing"
          :disabled="local.processing"
          >Cancel</p-button
        >
        <p-button
          variant="warning"
          @click.stop="handleSaveChangeShippingMethod"
          class="w-full"
          :loading="local.processing"
          :disabled="local.processing"
          >Upgrade</p-button
        >
      </div>
    </p-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import type { Order, Shipment } from '@/modules/home/types';
import {
  SHIPPING_METHOD_LIST,
  type ShippingMethod,
} from '@/modules/insight/constant';
import { useOrderStore } from '@/modules/home/store';
import { twMerge } from 'tailwind-merge';

const orderStore = useOrderStore();

const errorModal = ref();
const confirmModal = ref();
const upgradeBtn = ref();

const emits = defineEmits(['refresh']);

interface Props {
  data?: Order;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
});

interface Local {
  selectedNewShippingMethod?: ShippingMethod;
  processing: boolean;
}

const local: Local = reactive({
  selectedNewShippingMethod: undefined,
  processing: false,
});

const isDomestic = computed(() => {
  return [
    'US',
    'AS',
    'GU',
    'MP',
    'PR',
    'MH',
    'FM',
    'PW',
    'UM',
    'VI',
  ]?.includes(
    String(
      props.data?.address?.country,
    )?.toLocaleUpperCase(),
  );
});

const shippingMethodListAvailable = computed(() => {
  let totalMethod = [];
  if (isDomestic.value) {
    totalMethod = SHIPPING_METHOD_LIST?.filter(
      (s: ShippingMethod) =>
        ['standard', 'priority', 'express']?.includes(
          String(s.value),
        ),
    );
  } else {
    totalMethod = SHIPPING_METHOD_LIST.filter(
      (s: ShippingMethod) =>
        ['standard', 'express']?.includes(String(s.value)),
    );
  }
  let currentMethodIdx = totalMethod?.findIndex(
    (s: ShippingMethod) =>
      s.value === props.data?.shipping_method,
  );
  if (currentMethodIdx > -1) {
    return totalMethod.slice(currentMethodIdx + 1);
  }
  return totalMethod;
});

const checkShipmentsHasLabelURL = computed(() => {
  if (
    !Array.isArray(props.data?.shipment) ||
    props.data?.shipment.length === 0
  )
    return false;
  return props.data?.shipment?.some(
    (s: Shipment) => !!s.label_url,
  );
});

const showUpgradeBtn = computed(() => {
  return (
    Number(props.data?.order_type) !== 5 &&
    !checkShipmentsHasLabelURL.value && //Order type is not label order
    props.data?.shipping_method &&
    ['standard', 'priority', 'express'].includes(
      props.data?.shipping_method,
    ) &&
    ['new_order', 'in_production', 'draft']?.includes(
      String(props.data?.order_status),
    ) &&
    shippingMethodListAvailable.value.length > 0 &&
    isDomestic.value // Tạm thời chỉ cho thay đổi đối với đơn nội địa (sau này sẽ mở lại cho quốc tế)
  );
});

const shippingMethodName = computed(() => {
  return (
    SHIPPING_METHOD_LIST?.find(
      (s: ShippingMethod) =>
        s.value === props.data?.shipping_method,
    )?.title ||
    String(props.data?.shipping_method)
      ?.charAt(0)
      ?.toUpperCase() +
      String(props.data?.shipping_method)?.slice(1) ||
    'Other'
  );
});

const handleSaveChangeShippingMethod = async () => {
  try {
    local.processing = true;
    const payload = {
      order_id: props.data?.encode_id,
      shipping_method: String(
        local.selectedNewShippingMethod?.value,
      ),
    };
    const data =
      await orderStore.updateShippingMethod(payload);
    if (!data?.isError) {
      emits('refresh');
    } else {
      showErrorModal();
    }
  } catch (error) {
  } finally {
    local.processing = false;
    cancelConfirmModal();
  }
};

const showErrorModal = () => {
  errorModal.value.show();
};

const cancelErrorModal = () => {
  emits('refresh');
  errorModal.value.hide();
};

const showConfirmModal = () => {
  confirmModal.value.show();
};

const cancelConfirmModal = () => {
  confirmModal.value.hide();
};
</script>

<style scoped>
p-dialog::part(panel) {
  width: auto;
  max-width: 90vw;
  min-width: 350px;
  background-image: url('/modal-bg.png');
  background-repeat: no-repeat;
}
</style>

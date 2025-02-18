<template>
  <div class="relative flex w-full flex-col gap-md">
    <div
      class="relative flex w-full items-center justify-between"
    >
      <span
        class="text-sm font-semibold text-gray-900 md:text-base"
      >
        Order details
      </span>
      <p-button
        @click="showConfirm()"
        variant="danger"
        outline
        size="small"
        v-if="
          ['draft', 'in_production', 'new_order']?.includes(
            String(props.data?.order_status),
          )
        "
      >
        <p-icon
          slot="prefix"
          name="slash-octagon"
          library="custom"
        ></p-icon
        >Cancel order
      </p-button>
    </div>
    <div
      class="relative flex w-full flex-col divide-x-0 divide-y divide-gray-200 rounded-xl border border-gray-200 p-lg md:p-xl"
    >
      <div
        class="relative flex w-full flex-col gap-lg pb-lg md:flex-row md:gap-xl"
      >
        <div
          class="flex w-full flex-row items-center justify-between gap-xs md:flex-col md:items-start md:justify-start"
        >
          <span class="text-sm font-medium text-gray-600">
            Order number
          </span>
          <span class="text-sm font-medium text-gray-900">
            {{ props.data?.encode_id }}
          </span>
        </div>
        <div
          class="flex w-full flex-row items-center justify-between gap-xs md:flex-col md:items-start md:justify-start"
        >
          <span class="text-sm font-medium text-gray-600">
            Created at
          </span>
          <span
            class="text-sm font-medium text-gray-900"
            v-if="props.data?.created_at"
          >
            {{
              dateFormat.from(
                new Date(
                  new Date(
                    String(props.data?.created_at),
                  ).toLocaleString('en-US', {
                    timeZone: 'UTC',
                  }),
                ),
                'MMM DD, YYYY hh:mm A',
              )
            }}
          </span>
        </div>
        <div
          class="flex w-full flex-row items-center justify-between gap-xs md:flex-col md:items-start md:justify-start"
        >
          <span class="text-sm font-medium text-gray-600">
            Order status
          </span>
          <span
            class="text-sm font-medium text-gray-900"
            id="order_status"
          >
            <p-tag
              v-if="props.data?.order_status"
              size="small"
              variant="primary"
              class="selected-order-status"
            >
              {{
                STATUS_LIST?.find(
                  (s: OrderStatus) =>
                    s.value === props.data?.order_status,
                )?.title
              }}
            </p-tag>
          </span>
        </div>
        <div
          class="flex w-full flex-row items-center justify-between gap-xs md:flex-col md:items-start md:justify-start"
          v-if="
            [5, 6].includes(Number(props.data?.order_type))
          "
        >
          <span class="text-sm font-medium text-gray-600">
            Order type
          </span>
          <span class="text-sm font-medium text-gray-900">
            <p-tag
              size="small"
              variant="primary"
              v-if="Number(props.data?.order_type) === 5"
            >
              <p-icon name="bookmark-star"></p-icon>
              Label order
            </p-tag>

            <p-tag
              size="small"
              variant="neutral"
              v-if="Number(props.data?.order_type) === 6"
            >
              <p-icon name="tiktok"></p-icon>
              Tiktok order
            </p-tag>

            <p-tag
              size="small"
              variant="danger"
              v-if="Number(props.data?.order_type) === 7"
            >
              <p-icon name="ticket-perforated"></p-icon>
              Licensed order
            </p-tag>
          </span>
        </div>
      </div>
      <div
        class="relative flex min-h-[140px] w-full flex-col items-start divide-x-0 divide-y divide-gray-200 pt-lg md:flex-row md:divide-x md:divide-y-0"
      >
        <div
          class="relative flex flex-1 flex-col gap-lg pb-lg pt-0 sm:pt-lg md:pb-0 lg:pr-lg lg:pt-0"
        >
          <span class="text-sm font-medium text-gray-600">
            Return address
          </span>
          <div
            class="text-sm font-medium text-gray-900"
            v-if="!props?.loading"
          >
            <p>
              {{ getReturnAddress('name') ?? '' }}
            </p>
            <p>
              {{
                getReturnAddress('street1')
                  ? `${getReturnAddress('street1')},`
                  : ''
              }}
              {{
                getReturnAddress('street2')
                  ? `${getReturnAddress('street2')},`
                  : ''
              }}
              {{
                getReturnAddress('city')
                  ? `${getReturnAddress('city')},`
                  : ''
              }}
              {{
                getReturnAddress('state')
                  ? `${getReturnAddress('state')},`
                  : ''
              }}
              {{
                getReturnAddress('zip')
                  ? `${getReturnAddress('zip')},`
                  : ''
              }}
              {{ getReturnAddress('country') ?? '' }}
            </p>
            <p>
              {{ getReturnAddress('email') ?? '' }}
            </p>
            <p>
              {{ getReturnAddress('phone') ?? '' }}
            </p>
          </div>
          <template v-else>
            <div
              class="h-5 w-[50%] animate-pulse rounded-sm bg-gray-50"
            ></div>
            <div
              class="h-5 w-full animate-pulse rounded-sm bg-gray-50"
            ></div>
            <div
              class="h-5 w-[80%] animate-pulse rounded-sm bg-gray-50"
            ></div>
          </template>
        </div>
        <div
          class="relative flex flex-1 flex-col gap-lg pt-lg md:pl-lg lg:pt-0"
        >
          <span class="text-sm font-medium text-gray-600">
            Shipping address
          </span>
          <div
            class="text-sm font-medium text-gray-900"
            v-if="!props?.loading"
          >
            <p>
              {{ getAddress('name') ?? '' }}
            </p>
            <p>
              {{
                getAddress('street1')
                  ? `${getAddress('street1')},`
                  : ''
              }}
              {{
                getAddress('street2')
                  ? `${getAddress('street2')},`
                  : ''
              }}
              {{
                getAddress('city')
                  ? `${getAddress('city')},`
                  : ''
              }}
              {{
                getAddress('state')
                  ? `${getAddress('state')},`
                  : ''
              }}
              {{
                getAddress('zip')
                  ? `${getAddress('zip')},`
                  : ''
              }}
              {{ getAddress('country') ?? '' }}
            </p>
            <p>
              {{ getAddress('email') ?? '' }}
            </p>
            <p>
              {{ getAddress('phone') ?? '' }}
            </p>
          </div>
          <template v-else>
            <div
              class="h-5 w-[50%] animate-pulse rounded-sm bg-gray-50"
            ></div>
            <div
              class="h-5 w-full animate-pulse rounded-sm bg-gray-50"
            ></div>
            <div
              class="h-5 w-[80%] animate-pulse rounded-sm bg-gray-50"
            ></div>
          </template>
        </div>
      </div>
    </div>
    <p-dialog
      label="Cancel order"
      class="cancel-order-dialog"
      ref="cancelModal"
      @p-after-hide="
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        }
      "
      @p-after-show="
        (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        }
      "
    >
      <div class="max-w-[500px]">
        {{ cancelOrderText }}
      </div>
      <p-button
        :loading="local.processing"
        slot="footer"
        variant="default"
        @click.stop="hideConfirm"
        >Cancel</p-button
      >
      <p-button
        :loading="local.processing"
        slot="footer"
        variant="danger"
        @click.stop="handleCancelOrder"
        >Submit</p-button
      >
    </p-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import type { Order } from '@/modules/home/types';
import dateFormatter from 'pure-date-format';
import { STATUS_LIST } from '@/modules/home/constant';
import type { OrderStatus } from '@/modules/home/types';
import { useOrderStore } from '@/modules/home/store';

const dateFormat = dateFormatter();
const orderStore = useOrderStore();

interface Props {
  data?: Order;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  loading: false,
});

const emits = defineEmits(['close-refresh']);

const cancelModal = ref();

const selectedOrderStatusColor = computed(() => {
  return STATUS_LIST?.find(
    (s: OrderStatus) =>
      s.value === props.data?.order_status,
  )?.color;
});

interface Local {
  processing?: boolean;
  currentPreviewImage: string;
  showPreviewImage: boolean;
}

const local = reactive<Local>({
  processing: false,
  currentPreviewImage: '',
  showPreviewImage: false,
});

const cancelOrderText = computed(() => {
  return props.data?.order_status === 'in_production'
    ? `Are you sure you want to cancel this order? You'll be charged for the production price, but there won't be any shipping price`
    : 'Are you sure to cancel this order?';
});

const showConfirm = () => {
  cancelModal.value.show();
};

const hideConfirm = () => {
  cancelModal.value.hide();
};

const handleCancelOrder = async () => {
  try {
    local.processing = true;
    await orderStore.cancel(String(props.data?.encode_id));
    hideConfirm();
    setTimeout(() => {
      emits('close-refresh');
    }, 500);
  } catch (error) {
  } finally {
    local.processing = false;
  }
};

const getReturnAddress = (field: string) => {
  let object =
    Array.isArray(props.data?.return_address) &&
    props.data?.return_address.length > 0
      ? props.data?.return_address[0]
      : Array.isArray(props.data?.store_return_address) &&
          props.data?.store_return_address.length > 0
        ? props.data?.store_return_address[0]
        : props.data?.ware_house;
  return object?.[field] || '';
};

const getAddress = (field: string) => {
  let object = props.data?.address;
  return object?.[field] || '';
};
</script>

<style scoped>
p-dialog.cancel-order-dialog::part(panel) {
  width: auto;
  max-width: 90vw;
  min-width: 20vw;
}

.selected-order-status::part(base) {
  background-color: color-mix(
    in srgb,
    var(--p-color-neutral-0) 100%,
    v-bind(selectedOrderStatusColor) 10%
  );
  color: v-bind(selectedOrderStatusColor);
  border-color: color-mix(
    in srgb,
    var(--p-color-neutral-0) 100%,
    v-bind(selectedOrderStatusColor) 40%
  );
}
</style>

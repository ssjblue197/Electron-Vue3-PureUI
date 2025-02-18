<template
  v-if="
    Array.isArray(props.data?.shipment) &&
    props.data?.shipment.length > 0
  "
>
  <div
    class="relative flex w-full flex-col gap-md"
    v-for="(shipment, index) in props.data?.shipment"
    :key="index"
  >
    <span
      class="text-sm font-semibold text-gray-900 md:text-base"
    >
      Shipment #{{ index + 1 }}
    </span>

    <div
      class="relative flex w-full flex-1 flex-col items-center justify-between gap-lg rounded-xl border border-gray-200 p-lg pb-lg md:gap-xl md:p-xl"
    >
      <div
        class="flex w-full items-center justify-between"
        v-if="shipment?.tracking_number"
      >
        <span class="text-sm font-medium text-gray-600">
          Tracking
        </span>
        <a
          v-if="shipment?.url"
          class="text-sm font-medium text-brand-600"
          :href="shipment?.url"
          target="_blank"
        >
          {{ shipment?.tracking_number }}
        </a>
        <span
          v-else
          class="text-sm font-medium text-gray-900"
        >
          {{ shipment?.tracking_number }}
        </span>
      </div>
      <div
        class="flex w-full items-center justify-between"
        v-if="shipment?.shipping_carrier"
      >
        <span class="text-sm font-medium text-gray-600">
          Carrier
        </span>
        <span class="text-sm font-medium text-gray-900">
          {{ shipment?.shipping_carrier?.name ?? '' }}
        </span>
      </div>
      <div
        class="flex w-full items-center justify-between"
        v-if="shipment?.service_code"
      >
        <span class="text-sm font-medium text-gray-600">
          Service
        </span>
        <span class="text-sm font-medium text-gray-900">
          {{
            shipment?.shipping_carrier_service
              ?.display_name ?? shipment?.service_code
          }}
        </span>
      </div>
      <div
        class="flex w-full items-center justify-between"
        v-if="shipment?.ship_date"
      >
        <span class="text-sm font-medium text-gray-600">
          Ship date
        </span>
        <span class="text-sm font-medium text-gray-900">
          {{ shipment?.ship_date }}
        </span>
      </div>
      <div
        class="flex w-full items-center justify-between"
        v-if="shipment?.label_url"
      >
        <span class="text-sm font-medium text-gray-600">
          Label
        </span>
        <a
          v-if="shipment?.label_url"
          class="text-sm font-medium text-brand-600"
          :href="shipment?.label_url"
          target="_blank"
        >
          Link label
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/modules/home/types';

interface Props {
  data?: Order;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
});
</script>

<style scoped></style>

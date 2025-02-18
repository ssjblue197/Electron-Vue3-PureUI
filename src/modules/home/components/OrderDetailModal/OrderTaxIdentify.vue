<template>
  <div
    class="relative flex w-full flex-col gap-md"
    v-if="
      props.data?.ioss_number && props.data?.tax_id_type
    "
  >
    <span
      class="text-sm font-semibold text-gray-900 md:text-base"
    >
      Tax identifier
    </span>
    <div
      class="relative flex w-full items-center justify-between rounded-xl border border-gray-200 p-lg md:p-xl"
    >
      <span class="text-sm font-medium text-gray-600">
        {{ props.data?.tax_id_type }}: #{{
          props.data?.ioss_number
        }}
      </span>
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

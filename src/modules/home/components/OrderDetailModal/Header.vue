<template>
  <div class="flex w-full items-center gap-xl">
    <div
      class="flex aspect-square w-12 items-center justify-center rounded-lg border border-gray-200 text-title-xs text-gray-700 shadow-xs"
    >
      <p-icon
        name="presentation-chart-01"
        library="custom"
      ></p-icon>
    </div>
    <div class="flex flex-1 flex-col gap-xs">
      <span class="text-lg font-semibold text-gray-900">
        Order details
      </span>
      <div class="flex items-center gap-sm">
        <p-tag
          variant="warning"
          size="small"
          v-if="!props.data?.calculated_at"
          >Calculating</p-tag
        >
        <p-tag
          variant="success"
          size="small"
          v-if="!!props.data?.plastic_bag"
          >Plastic bag</p-tag
        >
        <template
          v-if="
            Array.isArray(props.data?.order_insert) &&
            props.data?.order_insert.length > 0
          "
        >
          <p-badge
            size="small"
            v-for="(i, idx) in props.data.order_insert"
            :key="idx"
            :variant="
              ORDER_INSERT_TYPE_LIST?.find(
                (item) => item?.value === i?.type,
              )?.variant
            "
            class="h-[26px] cursor-pointer text-sm"
            @click="openNewWindow(i?.url)"
          >
            {{
              ORDER_INSERT_TYPE_LIST?.find(
                (item) => item?.value === i?.type,
              )?.title
            }}
            <span v-if="i?.size"> ({{ i?.size }}) </span>
          </p-badge>
        </template>
        <p-tag
          v-if="props.data?.is_test"
          size="small"
          variant="danger"
          class="h-[26px] text-sm"
        >
          Test
        </p-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '@/modules/home/types';
import { ORDER_INSERT_TYPE_LIST } from '@/modules/home/constant';
import { openNewWindow } from '@/modules/home/constant';

interface Props {
  data?: Order;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
});
</script>

<style scoped></style>

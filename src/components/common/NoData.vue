<template>
  <div
    class="relative flex aspect-square w-[480px] flex-col items-center gap-xl bg-[url('@/assets/images/nodata.png')] bg-cover bg-center bg-no-repeat"
  >
    <div
      class="center aspect-square w-14 rounded-lg border border-gray-200 text-title-xs shadow-xs"
    >
      <p-icon name="search" class="center"></p-icon>
    </div>
    <div
      class="absolute top-[calc(50%+40px)] flex w-full flex-col items-center gap-xl"
    >
      <span
        class="text-base font-semibold text-gray-900 md:text-xl"
      >
        {{ props.title }}
      </span>
      <span
        class="md:text-md text-sm font-normal text-gray-600"
      >
        {{ props.description }}
      </span>
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Not found',
  description:
    'Looks like catalogs are playing hide and seek!',
});
</script>

<style scoped></style>

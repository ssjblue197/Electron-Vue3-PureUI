<template>
  <div class="relative h-full w-full" ref="moreContainer">
    <slot name="items"></slot>
    <p-dropdown v-show="moreValue > 0" hoist>
      <div
        :class="
          twMerge(
            'relative aspect-square h-10 w-10 select-none rounded-full border border-gray-200',
            props.triggerClasses,
          )
        "
        slot="trigger"
      >
        <span
          class="center trigger text-sm font-medium text-gray-700"
          >+{{ moreValue }}</span
        >
      </div>
      <div
        class="flex max-h-[300px] w-full max-w-[300px] flex-wrap gap-sm overflow-y-auto rounded-md border border-gray-200 bg-white p-md"
        ref="moreItems"
      ></div>
    </p-dropdown>
    <div
      class="absolute left-0 top-0 z-[1] h-full w-full overflow-hidden bg-white"
      v-if="loading"
    >
      <slot name="skeleton"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isFullyInside } from '@/utils/helper';
import { twMerge } from 'tailwind-merge';

interface Props {
  triggerClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
  triggerClasses: '',
});

const moreContainer = ref<HTMLDivElement | null>(null);
const moreItems = ref<HTMLDivElement | null>(null);

const moreValue = ref(0);

const loading = ref<boolean>(true);

onMounted(() => {
  if (!moreContainer.value) return;
  const items = moreContainer.value.querySelectorAll(
    'span:not(.trigger)',
  );

  setTimeout(() => {
    let flag = -1;
    items.forEach((item, idx) => {
      if (
        !isFullyInside(
          moreContainer.value as HTMLElement,
          item,
        )
      ) {
        if (flag === -1) {
          flag = idx;
        }
        moreItems.value?.append(item);
        moreValue.value += 1;
      } else {
        (item as HTMLElement).style.visibility ===
          'visible !important';
      }
    });

    if (flag !== -1) {
      moreItems.value?.appendChild(items[flag - 1]);
      moreValue.value += 1;
    }
    loading.value = false;
  }, 0);
});
</script>

<style scoped></style>

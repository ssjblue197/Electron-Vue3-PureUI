<template>
  <p-dialog
    :label="props.data?.name"
    :open="props.open"
    @p-after-hide="() => emits('close')"
  >
    <div class="grid w-full grid-cols-3 gap-sm divide-x">
      <MobileNavigationItem
        v-for="item in props.data?.children"
        alwaysShow
        :key="String(item.router?.name)"
        :data="item"
        @close="() => emits('close')"
      />
    </div>
  </p-dialog>
</template>

<script setup lang="ts">
import type { SidebarRouter } from '@/components/sidebar/const';
import MobileNavigationItem from '@/components/navigation/MobileNavigationItem.vue';
interface Props {
  data?: SidebarRouter;
  open?: boolean;
}

const emits = defineEmits(['close']);
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  open: false,
});
</script>

<style scoped>
p-dialog::part(title) {
  text-align: center;
  padding: 1rem 0 0 0;
  font-weight: 500;
}

p-dialog::part(header-actions) {
  display: none;
}
</style>

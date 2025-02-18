<template>
  <div
    class="relative flex h-[68px] w-full items-center justify-evenly rounded-t-[20px] border-t shadow-md"
  >
    <MobileNavigationItem
      v-for="item in navigationMenu"
      :data="item"
      :key="item.router?.name"
    />
    <div
      class="flex h-full w-[60px] cursor-pointer select-none flex-col items-center justify-center gap-xs text-gray-700"
      @click="openMoreModal"
    >
      <p-icon-button name="three-dots"></p-icon-button>
    </div>
    <MoreModal
      :open="local.showMore"
      :data="navigationMore"
      @close="
        () => {
          local.showMore = false;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import sidebar, {
  type SidebarRouter,
} from '@/components/sidebar/const';
import MobileNavigationItem from '@/components/navigation/MobileNavigationItem.vue';
import MoreModal from '@/components/navigation/MoreModal.vue';

interface Local {
  showMore: boolean;
}

const local: Local = reactive({
  showMore: false,
});

const navigationMenu = computed(() => {
  return sidebar
    .filter((i: SidebarRouter) => !!i.orderMobile)
    .sort(
      (a: SidebarRouter, b: SidebarRouter) =>
        a.orderMobile! - b.orderMobile!,
    );
});

const navigationMore = computed(() => {
  return sidebar.filter(
    (i: SidebarRouter) => !i?.orderMobile,
  );
});

const openMoreModal = () => {
  local.showMore = true;
};
</script>

<style scoped></style>

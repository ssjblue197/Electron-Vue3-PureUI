<template>
  <div
    class="flex h-full flex-1 flex-col items-center justify-center rounded-md text-gray-700"
    :class="
      twMerge(
        isActiveRoute ? '!bg-brand-100 !text-gray-800' : '',
      )
    "
    @click="handleRouteTo(props?.data)"
  >
    <p-icon-button
      :name="props.data?.icon || props.data?.iconMobile"
      :label="props.data?.name"
      library="custom"
      :class="
        twMerge(
          'transition-all duration-150 will-change-auto',
          isActiveRoute ? 'scale-110 !text-brand-600' : '',
        )
      "
    ></p-icon-button>
    <span
      class="overflow-hidden text-xs font-medium transition-all duration-150 will-change-auto"
      :class="
        twMerge(
          isActiveRoute || props.alwaysShow
            ? 'max-h-[20px]'
            : 'max-h-0',
          isActiveRoute ? '!text-brand-600' : '',
        )
      "
    >
      {{ props.data?.name }}
    </span>
    <SubMenuModal
      :open="local.openSubMenu"
      :data="props.data"
      @close="
        () => {
          local.openSubMenu = false;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import type { SidebarRouter } from '@/components/sidebar/const';
import { useRouter, useRoute } from 'vue-router';
import { twMerge } from 'tailwind-merge';
import SubMenuModal from '@/components/navigation/SubMenuModal.vue';

const route = useRoute();
const router = useRouter();

interface Props {
  data?: SidebarRouter;
  alwaysShow?: boolean;
}

const emits = defineEmits(['close']);
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  alwaysShow: false,
});

interface Local {
  openSubMenu: boolean;
  selectedItem: SidebarRouter | undefined;
}

const local: Local = reactive({
  openSubMenu: false,
  selectedItem: undefined,
});

const handleRouteTo = (data?: SidebarRouter) => {
  if (
    Array.isArray(data?.children) &&
    data?.children.length > 0
  ) {
    // TODO: implement
    local.selectedItem = data;
    local.openSubMenu = true;
  } else {
    setTimeout(() => {
      emits('close');
    }, 0);
    router.push({
      name: data?.router?.name,
    });
  }
};

const isActiveRoute = computed(() => {
  return (
    props.data?.router?.name === route.name ||
    props.data?.children?.find(
      (i: SidebarRouter) => i.router?.name === route.name,
    )
  );
});
</script>

<style scoped></style>

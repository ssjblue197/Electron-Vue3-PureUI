<template>
  <div
    @click.stop="
      () => {
        if (Array.isArray(props.data?.children)) {
          if (systemStore.isCollapseSidebar) {
            return;
          }
          props.data.isOpen = !props.data.isOpen;
        } else {
          routeTo(String(props.data?.router?.name));
        }
      }
    "
    :class="
      twMerge(
        'menu-item duration-250 relative flex cursor-pointer select-none flex-col gap-xs overflow-hidden rounded-sm transition-all will-change-auto',
        props.data?.isOpen ? 'max-h-[100vh]' : 'max-h-12',
      )
    "
  >
    <div
      :class="
        twMerge(
          'flex w-full items-center gap-md py-md text-gray-700 hover:bg-gray-50 hover:text-gray-800',
          props.data?.router?.name === route.name
            ? '!bg-gray-50 !text-gray-800'
            : '',
          !systemStore.isCollapseSidebar
            ? 'px-lg'
            : 'justify-center',
        )
      "
    >
      <p-dropdown
        ref="dropdownRef"
        v-if="systemStore.isCollapseSidebar"
        behavior="hover"
        hoist
      >
        <!-- @mouseleave="() => hideDropdown()" -->
        <span slot="trigger">
          <p-icon-button
            :name="props.data?.icon"
            :label="props.data?.name"
            library="custom"
            v-if="
              Array.isArray(props.data?.children) &&
              props.data?.children.length > 0
            "
          ></p-icon-button>
          <p-tooltip
            v-else
            :content="props.data?.name"
            hoist
            placement="right"
          >
        <span class="relative">
          <p-icon-button
            :name="props.data?.icon"
            :label="props.data?.name"
            library="custom"
          ></p-icon-button>
          <span class="absolute -top-1 right-1.5">
            <slot name="notify">
            </slot>
          </span>
        </span>
          </p-tooltip>
        </span>
        <p-menu
          v-if="
            Array.isArray(props.data?.children) &&
            props.data?.children.length > 0
          "
        >
          <div
            class="absolute left-0 top-0 h-4 w-full translate-y-[-100%] bg-red-500"
          ></div>
          <p-menu-label
            class="!text-sm !font-normal !text-gray-600"
            >{{ props.data?.name }}</p-menu-label
          >
          <p-menu-item
            v-for="i in props.data?.children"
            :key="i.id"
            @click="routeTo(String(i?.router?.name))"
            >{{ i?.name }}</p-menu-item
          >
        </p-menu>
      </p-dropdown>
      <span v-else class="relative">
        <p-icon-button
            :name="props.data?.icon"
            :label="props.data?.name"
            library="custom"
            :class="
          twMerge(
            props.data?.router?.name === route.name
              ? '!bg-gray-50 !text-gray-800'
              : '',
          )
        "
        ></p-icon-button>
         <span class="absolute top-1 right-1.5">
            <slot name="notify">
            </slot>
          </span>
      </span>
      <span
        class="text-base font-semibold"
        v-if="!systemStore.isCollapseSidebar"
      >
        {{ props.data?.name }} <p-tag variant="primary" size="small" class="ml-2" v-if="props.data?.isNew">New</p-tag>
      </span>
      <p-icon-button
        v-if="
          Array.isArray(props.data?.children) &&
          props.data?.children.length > 0 &&
          !systemStore.isCollapseSidebar
        "
        name="chevron-down"
        library="custom"
        :class="
          twMerge(
            'ml-auto transition-all duration-150',
            props.data?.isOpen ? 'rotate-180' : 'rotate-0',
          )
        "
      ></p-icon-button>
    </div>

    <div
      class="flex w-full flex-col gap-xs"
      v-if="
        Array.isArray(props.data?.children) &&
        props.data?.children.length > 0
      "
    >
      <SidebarItem
        v-for="i in props.data?.children"
        :key="i.id"
        :data="i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SidebarRouter } from '@/components/sidebar/const';
import { useRouter, useRoute } from 'vue-router';
import { twMerge } from 'tailwind-merge';
import { useSystemStore } from '@/stores/system';
import { ref } from 'vue';

const systemStore = useSystemStore();
const route = useRoute();
const router = useRouter();

const dropdownRef = ref();

interface Props {
  data?: SidebarRouter;
}

const emit = defineEmits(['end']);
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
});

const routeTo = (name: string) => {
  return router.push({
    name,
  });
};

const hideDropdown = () => {
  if (dropdownRef.value) {
    dropdownRef.value?.hide();
  }
};
</script>

<style scoped></style>

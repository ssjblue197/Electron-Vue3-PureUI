<template>
  <div
    id="sidebar"
    class=""
    :class="
      twMerge(
        'relative z-10 flex h-full w-[260px] select-none flex-col transition-all duration-300 2xl:w-[312px]',
        !systemStore.isCollapseSidebar
          ? 'w-[260px] 2xl:w-[312px]'
          : '!w-[80px]',
      )
    "
  >
    <div
      class="flex h-[calc(100%-80px)] flex-col overflow-y-auto overflow-x-hidden px-xs md:p-xl xl:overflow-y-hidden xl:hover:overflow-y-auto"
      id="sidebar-scroll-area"
    >
      <div
        class="navigation flex flex-col gap-4 pt-md md:gap-6"
      >
        <div
          class="flex w-full cursor-pointer items-center gap-2"
          :class="
            systemStore.isCollapseSidebar
              ? 'justify-center'
              : 'justify-start'
          "
          @click="navigateToHome"
        >
          <img src="/logo.png" alt="logo" class="h-10" />
          <span
            class="text-lg font-bold text-gray-900"
            v-if="!systemStore.isCollapseSidebar"
          >
            PureUI
          </span>
        </div>
        <div class="menu flex flex-col gap-xs">
          <template v-for="i in sidebar" :key="i.id">
            <SidebarItem :data="i"> </SidebarItem>
          </template>
        </div>
      </div>
    </div>

    <div class="px-xs md:p-xl">
      <div
        id="footer"
        class="absolute bottom-0 left-0 flex h-20 shrink-0 items-center gap-lg overflow-hidden border-t border-gray-200 px-xs py-lg pt-2xl"
      >
        <div class="flex flex-1 items-center gap-lg">
          <p-dropdown
            class="mx-auto"
            v-if="systemStore.isCollapseSidebar"
            hoist
          >
            <span slot="trigger" class="cursor-pointer">
              <p-tooltip
                :content="
                  authStore?.user?.name ||
                  authStore?.user?.username
                "
                hoist
              >
                <p-avatar
                  label="User avatar"
                  style="--size: 40px"
                ></p-avatar>
              </p-tooltip>
            </span>
            <p-menu>
              <p-menu-item @click="showLogout">
                <span
                  class="flex items-center gap-xs text-error-500"
                >
                  Logout
                  <p-icon-button
                    name="box-arrow-right"
                    label="Logout"
                  ></p-icon-button>
                </span>
              </p-menu-item>
            </p-menu>
          </p-dropdown>
          <p-avatar
            v-else
            label="User avatar"
            style="--size: 40px"
          ></p-avatar>
          <div
            class="flex flex-col items-start"
            v-if="!systemStore.isCollapseSidebar"
          >
            <span
              class="text-sm font-semibold text-gray-700"
            >
              {{
                authStore?.user?.name ||
                authStore?.user?.username
              }} </span
            ><span
              class="text-sm font-normal text-gray-600"
              v-if="authStore?.user?.email"
            >
              {{ authStore?.user?.email }}
            </span>
          </div>
        </div>
        <p-icon-button
          v-if="!systemStore.isCollapseSidebar"
          @click="showLogout"
          name="box-arrow-right"
          label="Logout"
        ></p-icon-button>
      </div>
    </div>

    <p-button
      circle
      class="absolute right-0 top-10 z-10 ml-auto translate-x-[50%]"
      @click="handleCollapseSidebar"
    >
      <p-icon
        name="chevron-left"
        label="Show"
        class="center"
        :class="{
          'rotate-180': systemStore.isCollapseSidebar,
          'rotate-0': !systemStore.isCollapseSidebar,
        }"
      ></p-icon>
    </p-button>
    <p-dialog
      label="Logout"
      class="dialog-overview"
      ref="logoutModal"
    >
      By clicking logout, you are going to sign out from the
      current session.
      <p-button
        slot="footer"
        variant="default"
        @click.stop="cancelLogout"
        >Cancel</p-button
      >
      <p-button
        slot="footer"
        variant="danger"
        @click.stop="handleLogout"
        >Logout</p-button
      >
    </p-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/store';
import sidebar, {
  SidebarRouter,
} from '@/components/sidebar/const';
import SidebarItem from '@/components/sidebar/SidebarItem.vue';
import { useRouter, useRoute } from 'vue-router';
import { twMerge } from 'tailwind-merge';
import { useSystemStore } from '@/stores/system';
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';

const route = useRoute();
const router = useRouter();
const systemStore = useSystemStore();
const authStore = useAuthStore();

const logoutModal = ref();

const showLogout = () => {
  logoutModal.value.show();
};

const cancelLogout = () => {
  logoutModal.value.hide();
};

const handleLogout = () => {
  try {
    authStore.logout();
  } catch (error) {}
};

const navigateToHome = () => {
  router.push({ name: 'home' });
};

const handleCollapseSidebar = () => {
  systemStore.isCollapseSidebar =
    !systemStore.isCollapseSidebar;
  if (systemStore.isCollapseSidebar) {
    sidebar.forEach((i: SidebarRouter) => {
      i.isOpen = false;
    });
  }
};

const handleObserveWindowSize = () => {
  if (Number(window.innerWidth) < 768) {
    if (!systemStore.isCollapseSidebar) {
      systemStore.isCollapseSidebar = true;
    }
  } else {
    if (systemStore.isCollapseSidebar) {
      systemStore.isCollapseSidebar = false;
    }
  }
};

onMounted(() => {
  window.addEventListener(
    'resize',
    handleObserveWindowSize,
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    'resize',
    handleObserveWindowSize,
  );
});
</script>

<style scoped lang="scss">
#footer {
  @apply relative mt-auto w-full;
}
</style>

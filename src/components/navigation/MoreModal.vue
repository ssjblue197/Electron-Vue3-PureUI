<template>
  <p-dialog
    label="More"
    :open="props.open"
    @p-after-hide="() => emits('close')"
  >
    <div class="relative mt-4 flex w-full flex-col gap-xs">
      <span class="text-md font-medium text-gray-700"
        >Other features</span
      >
      <div
        class="relative grid w-full grid-cols-3 gap-sm divide-x"
      >
        <MobileNavigationItem
          v-for="item in props.data"
          alwaysShow
          :key="String(item.router?.name)"
          :data="item"
          @close="() => emits('close')"
          class="!h-[50px]"
        />
      </div>
    </div>

    <p-button
      variant="danger"
      @click="handleLogout"
      class="mt-8 w-full"
    >
      Logout
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
  </p-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/modules/auth/store';
import type { SidebarRouter } from '@/components/sidebar/const';
import MobileNavigationItem from '@/components/navigation/MobileNavigationItem.vue';
const authStore = useAuthStore();

interface Props {
  data?: Array<SidebarRouter>;
  open?: boolean;
}

const emits = defineEmits(['close']);
const props = withDefaults(defineProps<Props>(), {
  data: undefined,
  open: false,
});

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

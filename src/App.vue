<template>
  <div class="wrapper text-black" id="main">
    <DefaultLayout v-if="layoutName === 'default'" />
    <MainLayout v-if="layoutName === 'main'" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/components/layouts/MainLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import { useSystemStore } from '@/stores/system';

const route = useRoute();
const router = useRouter();

const layoutName = computed(() => {
  return route?.meta?.layout;
});

const readManifest = async () => {
  const systemStore = useSystemStore();
  try {
    const res = await fetch('/site.webmanifest', {
      headers: {
        pragma: 'no-cache',
        'cache-control': 'no-cache',
      },
    });
    const data = await res.json();
    if (data.version !== systemStore.version) {
      systemStore.isCheckNewVersion = true;
    }
    systemStore.version = data.version;
  } catch (error) {}
};

const checkUpdate = () => {
  const systemStore = useSystemStore();
  if (systemStore.isCheckNewVersion) {
    console.log('reload update...');

    systemStore.isCheckNewVersion = false;
    router.go(0);
  }
};

const handleEventOpenCloseApp = async () => {
  if (document.visibilityState === 'visible') {
    await readManifest();
    setTimeout(() => {
      checkUpdate();
    }, 100);
  }
  if (document.visibilityState === 'hidden') {
    console.log('CLOSE APP');
  }
};

onMounted(() => {
  // socket.asyncConnect();
  readManifest();
  document.addEventListener(
    'visibilitychange',
    handleEventOpenCloseApp,
  );
});

onBeforeUnmount(() => {
  document.removeEventListener(
    'visibilitychange',
    handleEventOpenCloseApp,
  );
});
</script>

<style scoped></style>

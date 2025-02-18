<template>
  <div class="wrapper">
    <div
      class="relative flex h-full w-full flex-col flex-nowrap sm:flex-row"
    >
      <!-- <HeaderMobile /> -->
      <Sidebar class="hidden sm:flex" />
      <div
        class="relative mt-3 h-[calc(100%-12px)] flex-1 overflow-y-auto overflow-x-hidden rounded-tl-[40px] border-l border-t border-gray-200 xl:overflow-y-hidden xl:hover:overflow-y-auto"
        id="layout-scroll-area"
        ref="mainLayout"
      >
        <router-view v-slot="{ Component }">
          <component :is="Component" class="!h-full" />
        </router-view>
      </div>
      <MobileNavigation class="sm:hidden" />
    </div>
    <ScrollButton
      class="z-999 fixed bottom-20 right-8"
      v-if="showScroll"
      @click="scrollToTop"
    />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Sidebar from '@/components/sidebar/Index.vue';
import ScrollButton from '@/components/common/ScrollToTop.vue';
import MobileNavigation from '@/components/navigation/MobileNavigation.vue';
// import HeaderMobile from '@/components/header/HeaderMobile.vue';

const showScroll = ref(false);
const mainLayout = ref<HTMLDivElement | null>(null);

const scrollToTop = () => {
  mainLayout.value?.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  if (!mainLayout.value) return;
  mainLayout.value.onscroll = () => {
    if (
      Number(mainLayout.value?.scrollTop) >
      window.innerHeight
    ) {
      showScroll.value = true;
    } else {
      showScroll.value = false;
    }
  };
});
onBeforeUnmount(() => {
  if (!mainLayout.value) return;
  if (mainLayout.value) {
    mainLayout.value.onscroll = () => {};
  }
});
</script>

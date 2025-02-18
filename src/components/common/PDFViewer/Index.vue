<template>
  <div
    class="relative h-full w-full overflow-hidden"
    ref="PDFViewer"
  >
    <div
      class="relative flex h-full w-full justify-center overflow-auto"
    >
      <VuePDF
        class="shadow-md"
        :pdf="sourcePDF?.pdf"
        :scale="local.scale"
        text-layer
        annotation-layer
        watermark-text="PDFViewer"
        intent="print"
        v-bind="$attrs"
      />
    </div>
    <div
      class="absolute right-4 top-4 flex items-center gap-2 divide-x rounded-md bg-white p-2 shadow-md"
    >
      <p-icon-button
        name="zoom-out"
        @click="handleScale('zoom-out')"
      ></p-icon-button>
      <p-icon-button
        name="zoom-in"
        @click="handleScale('zoom-in')"
      ></p-icon-button>
      <p-icon-button
        name="arrows-fullscreen"
        @click="handleFullscreen"
        v-if="!local.isFullscreen"
      ></p-icon-button>
      <p-icon-button
        name="fullscreen-exit"
        @click="handleExitFullscreen"
        v-else
      ></p-icon-button>
      <p-icon-button
        name="printer"
        @click="handlePrint"
      ></p-icon-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  reactive,
  onBeforeUnmount,
} from 'vue';
import { VuePDF, usePDF } from '@tato30/vue-pdf';
import '@tato30/vue-pdf/style.css';

interface Props {
  url?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  url: undefined,
  loading: false,
});

const PDFViewer = ref();
const sourcePDF = ref();

interface Local {
  scale: number;
  isFullscreen: boolean;
}

const local = reactive<Local>({
  scale: 1,
  isFullscreen: false,
});

const handlePrint = () => {
  sourcePDF.value?.print();
};

const handleScale = (action: 'zoom-out' | 'zoom-in') => {
  switch (action) {
    case 'zoom-in':
      if (local.scale < 3) {
        local.scale += 0.1;
      }
      break;
    case 'zoom-out':
      if (local.scale > 0.5) {
        local.scale -= 0.1;
      }
      break;
    default:
      break;
  }
};

const handleFullscreen = () => {
  (PDFViewer.value as HTMLElement)?.requestFullscreen();
};

const handleExitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

function fullscreenchangeHandler() {
  // document.fullscreenElement will point to the element that
  // is in fullscreen mode if there is one. If not, the value
  // of the property is null.
  if (document.fullscreenElement) {
    console.log(
      `Element: ${document.fullscreenElement.id} entered fullscreen mode.`,
    );
    local.isFullscreen = true;
  } else {
    console.log('Leaving fullscreen mode.');
    local.isFullscreen = false;
  }
}

onMounted(() => {
  if (props.url) {
    sourcePDF.value = usePDF({
      url: props.url,
      enableXfa: true,
    });
  }
  PDFViewer.value.addEventListener(
    'fullscreenchange',
    fullscreenchangeHandler,
  );
});
onBeforeUnmount(() => {
  PDFViewer.value.removeEventListener(
    'fullscreenchange',
    fullscreenchangeHandler,
  );
});
</script>

<style scoped></style>

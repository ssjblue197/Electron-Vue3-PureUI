<template>
  <p-dialog
    id="preview-image"
    :open="props.open"
    @p-after-hide="
      (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        emits('close');
      }
    "
    @p-after-show="
      (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      }
    "
  >
    <div
      class="flex w-full items-center gap-xl"
      slot="label"
    >
      <div
        class="flex aspect-square w-12 items-center justify-center rounded-lg border border-gray-200 text-title-xs text-gray-700 shadow-xs"
      >
        <p-icon name="image"></p-icon>
      </div>
      <div class="flex flex-1 flex-col gap-xs">
        <span class="text-lg font-semibold text-gray-900">
          Preview image
        </span>
      </div>
    </div>
    <img :src="props.url" alt="preview_image" />
  </p-dialog>
</template>

<script setup lang="ts">
interface Props {
  open?: boolean;
  url?: string;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  url: '',
});

const emits = defineEmits(['close']);
</script>

<style scoped>
p-dialog::part(header) {
  border-bottom: 1px solid var(--p-color-gray-200);
}
p-dialog::part(footer) {
  border-top: 1px solid var(--p-color-gray-200);
}
p-dialog::part(panel) {
  width: auto;
  max-width: 90vw;
  min-width: 55vw;
  min-height: 400px;
}
p-dialog#preview-image::part(body) {
  display: flex;
  justify-content: center;
}
</style>

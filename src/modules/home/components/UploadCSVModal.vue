<template>
  <p-dialog
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
        <p-icon name="share-01" library="custom"></p-icon>
      </div>
      <div class="flex flex-1 flex-col gap-xs">
        <span class="text-lg font-semibold text-gray-900">
          Upload CSV
        </span>
      </div>
    </div>
    <div class="relative flex w-full flex-col gap-sm">
      <p-file-upload
        ref="fileUpload"
        closable
        label="Support for uploading single files or in bulk, including CSV formats"
        @p-change="handleChangeFile"
        accept="text/csv"
        no-file-list
      >
        <span slot="button">
          <p-button variant="text">
            <span style="font-weight: 600"
              >Click to upload</span
            >
            <span style="font-weight: 400; color: #475467">
              or drag and drop</span
            >
          </p-button>
        </span>
      </p-file-upload>
      <template v-if="local.file">
        <p-file-upload-item
          closable
          :loading="
            systemStore.files[local.file.name]?.isLoading
          "
          :progress="
            Number(
              systemStore.files[local.file.name]?.progress,
            )
          "
        >
          {{ local.file.name }}
          <p-icon name="file-earmark" slot="image"></p-icon>
        </p-file-upload-item>
      </template>
    </div>
    <div
      class="flex w-full items-center gap-lg"
      slot="footer"
      v-if="local.file"
    >
      <p-button
        class="flex-1"
        @click="emits('close')"
        :loading="local.loading"
      >
        Cancel
      </p-button>
      <p-button
        :loading="local.loading"
        class="flex-1"
        variant="primary"
        @click="handleUpload"
        >Start upload</p-button
      >
    </div>
  </p-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useOrderStore } from '@/modules/home/store';
import { useSystemStore } from '@/stores/system';
import { generateUniqueId } from '@/utils/system';

const orderStore = useOrderStore();
const systemStore = useSystemStore();

const fileUpload = ref();

interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emits = defineEmits(['close', 'close-refresh']);

interface Local {
  loading: boolean;
  file: File | null;
}

const local = reactive<Local>({
  loading: false,
  file: null,
});

const handleChangeFile = (
  e: Event & {
    detail: Array<{
      accepted: boolean;
      file: File;
      loading?: boolean;
      progress?: number;
    }>;
  },
) => {
  if (e.detail[0].file) {
    local.file = e.detail[0].file;
  }
};

const handleUpload = async () => {
  if (local.file) {
    const uniqueId = generateUniqueId(local.file);
    try {
      local.loading = true;
      systemStore.initializeFile(uniqueId);
      const formData = new FormData();
      formData.append('file', local.file);
      await orderStore.uploadCSV(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total!,
          );
          percentCompleted;
          systemStore.setProgress(
            uniqueId,
            percentCompleted,
          );
        },
      });
      systemStore.setLoading(uniqueId, false);
      emits('close-refresh');
    } catch (error) {
      systemStore.setError(
        uniqueId,
        'Failed to upload file',
      );
      systemStore.setLoading(uniqueId, false);
    } finally {
      local.loading = false;
      systemStore.removeFile(uniqueId);
    }
  }
};
</script>

<style scoped lang="scss">
p-dialog::part(header) {
  border-bottom: 1px solid var(--p-color-gray-200);
}
p-dialog::part(footer) {
  border-top: 1px solid var(--p-color-gray-200);
}
p-dialog::part(panel) {
  width: auto;
  max-width: 90vw;
  min-width: 30vw;
}
</style>

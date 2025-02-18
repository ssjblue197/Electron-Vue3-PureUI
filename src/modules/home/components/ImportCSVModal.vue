<template>
  <p-dialog
    :open="props.open"
    @p-after-hide="emits('close')"
    @p-after-show="handleFilter"
  >
    <div
      class="flex w-full items-center gap-xl"
      slot="label"
    >
      <div
        class="flex aspect-square w-12 items-center justify-center rounded-lg border border-gray-200 text-title-xs text-gray-700 shadow-xs"
      >
        <p-icon name="hard-drive" library="custom"></p-icon>
      </div>
      <div class="flex flex-1 flex-col gap-xs">
        <span class="text-lg font-semibold text-gray-900">
          Order import
        </span>
      </div>
    </div>
    <div
      class="relative flex w-full flex-col items-start gap-xl"
    >
      <div
        class="relative flex w-full items-center justify-between"
      >
        <div class="flex items-center gap-md">
          <p-input
            class="w-[200px]"
            placeholder="Keyword"
            :value="local.filters?.search"
            @p-change="
              (e: Event) => {
                local.filters.search = (
                  e.target as HTMLInputElement
                ).value;
              }
            "
          >
            <p-icon name="search" slot="prefix"></p-icon>
          </p-input>
          <p-button variant="primary" @click="handleFilter">
            Search
          </p-button>
        </div>
        <div class="flex items-center gap-md">
          <p-button
            variant="default"
            @click="showUploadCSVModal"
          >
            <p-icon
              slot="prefix"
              name="share-01"
              library="custom"
            ></p-icon>
            Upload
          </p-button>
          <p-button
            variant="success"
            @click="handleDownloadTemplate"
          >
            <p-icon
              slot="prefix"
              name="download-01"
              library="custom"
            ></p-icon>
            Template
          </p-button>
        </div>
      </div>
      <div class="relative w-full">
        <p-table
          :options="local.options"
          :data="local.items"
          :loading="local.loading"
        >
          <p-paginate
            size="small"
            slot="paginate"
            :total="local.total"
            :page="local.filters.page"
            :limit="local.filters.limit"
            @p-change="handleChangePage"
            :loading="local.loading"
            @p-after-show="
              (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
              }
            "
            @p-after-hide="
              (e: Event) => {
                e.stopPropagation();
                e.preventDefault();
              }
            "
          >
          </p-paginate>
        </p-table>
      </div>
    </div>
    <UploadCSVModal
      :key="modalKey"
      :open="local.uploadModal"
      @close="
        () => {
          modalKey = makeid(10);
          local.uploadModal = false;
        }
      "
      @close-refresh="
        () => {
          modalKey = makeid(10);
          local.uploadModal = false;
          handleFilter();
        }
      "
    />
  </p-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type {
  RowDataImport,
  Filter,
} from '@/modules/home/types';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { useOrderStore } from '@/modules/home/store';
import dateFormatter from 'pure-date-format';
import makeid from '@/utils/makeid';
import UploadCSVModal from '@/modules/home/components/UploadCSVModal.vue';

const dateFormat = dateFormatter();
const orderStore = useOrderStore();

interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emits = defineEmits(['close']);

const modalKey = ref(makeid(10));

const apiUrlStorage: string = import.meta.env
  .VITE_API_STORAGE;

interface Local {
  loading: boolean;
  options: any;
  filters: Partial<Filter>;
  total: number;
  items: RowDataImport[];
  uploadModal: boolean;
}

const local = reactive<Local>({
  loading: false,
  options: {
    columns: [
      {
        field: 'file_name',
        id: 'file_name',
        headerName: 'File name',
        minWidth: '260px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: (row: RowDataImport) => {
          return html`
            <span
              style="color: var(--p-color-neutral-800); font-weight: 500;"
            >
              ${row?.file_name}
            </span>
          `;
        },
      },
      {
        field: 'created_at',
        id: 'created_at',
        headerName: 'Uploaded at',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: (row: RowData) =>
          html`${dateFormat.from(
            new Date(String(row?.created_at)),
            'YYYY-MM-DD HH:mm:ss',
          )}`,
      },
      {
        field: 'order_total',
        id: 'order_total',
        headerName: 'Order quantity',
        minWidth: '120px',
        render(row: RowDataImport) {
          return html`
            <span
              style="color: var(--p-color-neutral-600); font-weight: 500;"
            >
              ${row?.order_total}
            </span>
          `;
        },
      },
      {
        field: 'order_imported',
        id: 'order_imported',
        headerName: 'Success',
        minWidth: '120px',
        render(row: RowDataImport) {
          return html`
            <span
              style="color: var(--p-color-success-600); font-weight: 500;"
            >
              ${row?.order_imported}
            </span>
          `;
        },
      },
      {
        field: 'order_failed',
        id: 'order_failed',
        headerName: 'Failed',
        minWidth: '120px',
        render(row: RowDataImport) {
          return html`
            <span
              style="color: var(--p-color-danger-600); font-weight: 500;"
            >
              ${row?.order_failed}
            </span>
          `;
        },
      },
      {
        field: 'file_imported',
        id: 'file_imported',
        headerName: 'Original file',
        truncate: true,
        maxWidth: '200px',
        render(row: RowDataImport) {
          return html`
            <style>
              .link-file {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--p-color-brand-600);
                font-weight: 500;
                text-decoration: none;
              }
              .link-file:hover {
                text-decoration: underline;
              }
            </style>
            ${row?.file_imported
              ? html`
                  <a
                    href=${ifDefined(row?.file_imported)}
                    class="link-file"
                    >Download</a
                  >
                `
              : ''}
          `;
        },
      },
      {
        field: 'file_failed',
        id: 'file_failed',
        headerName: 'Error file',
        truncate: true,
        maxWidth: '200px',
        render(row: RowDataImport) {
          return html`
            <style>
              .link-file {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--p-color-brand-600);
                font-weight: 500;
                text-decoration: none;
              }
              .link-file:hover {
                text-decoration: underline;
              }
            </style>
            ${row?.file_failed
              ? html`
                  <a
                    href=${ifDefined(row?.file_failed)}
                    class="link-file"
                    >Download</a
                  >
                `
              : ''}
          `;
        },
      },
    ],
  },
  filters: {
    search: '',
    page: 1,
    limit: 10,
  },
  total: 0,
  items: [],
  uploadModal: false,
});

const handleChangePage = (
  e: Event & {
    detail: {
      page: number;
    };
  },
) => {
  local.filters.page = e?.detail?.page;
  handleFilter();
};

const handleFilter = async () => {
  try {
    local.loading = true;
    const data = await orderStore.importCSVInfo(
      local.filters,
    );
    local.total = data?.total || 0;
    local.items = data?.data || [];
  } catch (error) {
  } finally {
    local.loading = false;
  }
};

const handleDownloadTemplate = async () => {
  window.open(
    `${apiUrlStorage}/csv-template/import-csv-order-template.csv`,
    '_blank',
  );
};

const showUploadCSVModal = () => {
  local.uploadModal = true;
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
  min-width: 60vw;
}
</style>

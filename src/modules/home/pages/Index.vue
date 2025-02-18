<template>
  <div
    class="wrapper relative flex flex-col gap-4 p-4 !pt-0 md:p-8"
  >
    <div
      class="header sticky top-0 z-[9] flex flex-col items-start divide-y divide-gray-200 bg-white pb-4 pt-6 sm:pt-8"
    >
      <div
        class="flex w-full flex-col items-start gap-6 pb-6"
      >
        <span
          class="whitespace-nowrap text-title-sm font-semibold text-gray-900"
        >
          Orders
        </span>
        <div class="relative w-full overflow-x-auto">
          <OrderStatusFilter
            :data="local.orderSummary"
            :loading="local.calculateOrderSummary"
            :active="filters.order_status"
            :filters="filters"
            @update:active="handleChangeOrderStatus"
          />
        </div>
      </div>
      <div
        class="relative flex w-full items-start gap-lg pt-6"
      >
        <div
          class="relative hidden w-[calc(100%-192px-12px)] items-center gap-lg md:flex"
        >
          <p-smart-container class="w-full">
            <p-button variant="default" slot="trigger">
              <p-icon
                name="filter-lines"
                library="custom"
                slot="prefix"
              ></p-icon>
              More filter
            </p-button>
            <p-input
              class="min-w-[270px] max-w-[270px]"
              placeholder="Order/ref/tracking number"
              :value="filters?.key_search"
              @p-change="
                (e: Event) =>
                  setFieldValue(
                    'key_search',
                    (e.target as HTMLInputElement).value,
                  )
              "
              @keyup.enter="handleFilter"
            >
              <p-icon name="search" slot="prefix"></p-icon>
            </p-input>
            <p-input
              class="min-w-[160px] max-w-[160px]"
              placeholder="Product SKU"
              :value="filters?.sku"
              @p-change="
                (e: Event) =>
                  setFieldValue(
                    'sku',
                    (e.target as HTMLInputElement).value,
                  )
              "
              @keyup.enter="handleFilter"
            >
              <p-icon name="search" slot="prefix"></p-icon>
            </p-input>
            <p-calendar
              class="min-w-[290px] max-w-[290px]"
              type="range"
              show-adjacent-dates
              format="YYYY-MM-DD"
              :value="
                filters.order_date_start ||
                filters.order_date_end
                  ? [
                      filters.order_date_start,
                      filters.order_date_end,
                    ]
                  : []
              "
              @p-change="handleChangeDate"
              clearable
            ></p-calendar>
            <p-select
              placeholder="Order type"
              multiple
              .value="filters.order_type"
              @p-change="handleSelectOrderType"
              class="min-w-[230px] max-w-[230px]"
              max-options-visible="1"
            >
              <p-option
                v-for="t in ORDER_TYPE_LIST"
                :key="t?.value"
                :value="String(t?.value)"
                >{{ t?.title }}</p-option
              >
            </p-select>

            <div
              class="hidden items-center gap-3 md:flex"
              slot="suffix"
            >
              <p-button @click="handleReset"
                >Clear</p-button
              >
              <p-button
                variant="primary"
                @click="
                  () => {
                    handleFilter();
                    loadOrderSummary();
                  }
                "
                >Apply filter</p-button
              >
            </div>
          </p-smart-container>
        </div>
        <div class="ml-auto flex w-min items-center gap-lg">
          <p-button
            @click="local.showFilter = true"
            class="ml-auto block md:hidden"
          >
            <p-icon
              name="funnel"
              class="text-brand-600"
            ></p-icon>
          </p-button>
          <p-button
            v-if="!authStore.isSupportLogin"
            variant="default"
            @click="showImportModal"
          >
            Import
          </p-button>
          <p-button
            class="export-btn"
            variant="primary"
            @click="handleExport"
            :loading="local.loadingExport"
          >
            <p-icon
              name="ms_excel"
              slot="prefix"
              library="custom"
              class="text-[20px] text-transparent"
            ></p-icon>
            Export
          </p-button>
        </div>
      </div>
    </div>

    <p-drawer
      label="Filter"
      :open="local.showFilter"
      @p-after-hide="
        () => {
          local.showFilter = false;
        }
      "
    >
      <div class="flex w-full flex-col gap-4">
        <p-input
          class="flex-[1_1_0%]"
          placeholder="Order / ref / tracking number"
          :value="filters?.key_search"
          @p-change="
            (e: Event) =>
              setFieldValue(
                'key_search',
                (e.target as HTMLInputElement).value,
              )
          "
          label="Order / ref / tracking number"
        >
          <p-icon name="search" slot="prefix"></p-icon>
        </p-input>
        <p-input
          class="flex-[1_1_0%]"
          placeholder="Product SKU"
          :value="filters?.sku"
          @p-change="
            (e: Event) =>
              setFieldValue(
                'sku',
                (e.target as HTMLInputElement).value,
              )
          "
          label="Product SKU"
        >
          <p-icon name="search" slot="prefix"></p-icon>
        </p-input>
        <p-calendar
          class="flex-[1_1_0%]"
          type="range"
          show-adjacent-dates
          format="YYYY-MM-DD"
          :value="
            filters.order_date_start ||
            filters.order_date_end
              ? [
                  filters.order_date_start,
                  filters.order_date_end,
                ]
              : []
          "
          @p-change="handleChangeDate"
          label="Range date"
          clearable
          @p-after-hide="
            (e: Event) => {
              e.preventDefault();
              e.stopPropagation();
            }
          "
        ></p-calendar>
        <p-select
          label="Order type"
          placeholder="Order type"
          multiple
          .value="filters.order_type"
          @p-change="handleSelectOrderType"
          class="flex-[1_1_0%]"
          max-options-visible="1"
        >
          <p-option
            v-for="t in ORDER_TYPE_LIST"
            :key="t?.value"
            :value="String(t?.value)"
            >{{ t?.title }}</p-option
          >
        </p-select>

        <p-button
          class="mt-4 flex-[1_1_0%]"
          @click="
            () => {
              handleReset();
              local.showFilter = false;
            }
          "
          >Clear</p-button
        >
        <p-button
          class="flex-[1_1_0%]"
          variant="primary"
          @click="
            () => {
              filters.page = 1;
              handleFilter();
              loadOrderSummary();
              local.showFilter = false;
            }
          "
          >Apply filter</p-button
        >
      </div>
    </p-drawer>
    <div
      class="relative flex h-full min-h-[60vh] flex-col gap-xl"
    >
      <div
        class="flex w-full items-center justify-center"
        v-if="!local.loading && local.items.length == 0"
      >
        <NoData
          title="No order found"
          description="Looks like things are playing hide and seek!"
        >
          <template #action>
            <p-button @click="handleReset">
              Clear all filter
            </p-button>
          </template>
        </NoData>
      </div>
      <template
        v-if="
          !local.loading &&
          Array.isArray(local.items) &&
          local.items.length > 0
        "
      >
        <p-table
          :options="local.options"
          :data="local.items"
        >
          <p-paginate
            size="small"
            slot="paginate"
            :total="local.total"
            .page="filters.page"
            :pageList="[5, 10, 20, 50, 100]"
            :limit="filters.limit"
            @p-change="handleChangePage"
            @p-change-limit="handleChangeLimit"
            :loading="local.loading"
          >
          </p-paginate>
        </p-table>
      </template>
      <!-- <p-spinner
        class="center"
        v-if="local.loading"
      ></p-spinner> -->
      <template v-if="local.loading">
        <p-skeleton
          style="
            --border-radius: var(--p-border-radius-large);
          "
          class="!h-[60px] w-full shrink-0 animate-pulse rounded-sm"
        ></p-skeleton>
        <div
          class="flex w-full items-center gap-xl"
          v-for="r in 6"
          :key="r"
        >
          <p-skeleton
            v-for="i in 8"
            :key="i"
            style="
              --border-radius: var(--p-border-radius-large);
            "
            class="!h-[40px] flex-1 shrink-0 animate-pulse rounded-sm"
          ></p-skeleton>
        </div>
      </template>
      <div class="h-4 w-full shrink-0"></div>
    </div>

    <PreviewImage
      :open="local.showPreviewImage"
      :url="local.currentPreviewImage"
      @close="
        () => {
          local.showPreviewImage = false;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { html } from 'lit';
import {
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
} from 'vue';
import type { Filter, RowData } from '@/modules/home/types';
import { useFilter } from '@/composables/useFilter';
import { useOrderStore } from '@/modules/home/store';
import { useAuthStore } from '@/modules/auth/store';
import NoData from '@/components/common/NoData.vue';
import OrderStatusFilter from '@/modules/home/components/OrderStatusFilter.vue';
import {
  ORDER_TYPE_LIST,
  PAYMENT_STATUS_LIST,
  orderStatusTag,
  paymentStatusTag,
  formatDataExport,
} from '@/modules/home/constant';
import { useToast } from '@/composables/useToast';
import { exportToCsv } from '@/utils/exportCsv';
import dateFormatter from 'pure-date-format';
import EventBus from '@/utils/eventbus';
import {
  GLOBAL_EVENTS,
  ORDER_EVENTS,
} from '@/constants/eventbus';
import makeid from '@/utils/makeid';
import PreviewImage from '@/components/common/PreviewImage.vue';

const dateFormat = dateFormatter();
const toast = useToast();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const modalKey = ref(makeid(10));
interface Local {
  loading: boolean;
  items: RowData[];
  total: number;
  showFilter: boolean;
  options: any;
  orderSummary: Record<string, number>;
  calculateOrderSummary: boolean;
  loadingExport: boolean;
  selectedOrder?: RowData;
  detailModal: boolean;
  importModal: boolean;
  currentPreviewImage: string;
  showPreviewImage: boolean;
}

const local: Local = reactive({
  loading: false,
  items: [],
  total: 0,
  showFilter: false,
  options: {
    paginate: false,
    columns: [
      {
        field: 'encode_id',
        id: 'encode_id',
        headerName: 'Order number',
        minWidth: '120px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: (row: RowData) => {
          return html`
            <style>
              .link {
                text-decoration: none;
                color: var(--p-color-brand-600);
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
              }
            </style>
            <span
              class="link"
              @click=${() => showDetailModal(row)}
            >
              ${row?.encode_id}
            </span>
          `;
        },
      },
      {
        field: 'external_number',
        id: 'external_number',
        headerName: 'Ref number',
        minWidth: '240px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      {
        field: 'shipment_default.tracking_number',
        id: 'shipment_default.tracking_number',
        headerName: 'Tracking number',
        minWidth: '200px',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: (row: RowData) => {
          return html`
            <style>
              .link {
                text-decoration: none;
                color: var(--p-color-brand-600);
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
              }
            </style>
            ${row?.shipment_default?.url
              ? html`
                  <a
                    href=${row?.shipment_default?.url}
                    class="link"
                    target="_blank"
                  >
                    ${row?.shipment_default
                      ?.tracking_number}
                  </a>
                `
              : html`
                  <span>
                    ${row?.shipment_default
                      ?.tracking_number}
                  </span>
                `}
          `;
        },
      },
      {
        field: 'address.name',
        id: 'address.name',
        headerName: 'Recipient',
        minWidth: '160px',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      {
        field: 'order_type',
        id: 'order_type',
        headerName: 'Order type',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: (row: RowData) => {
          if (Number(row?.order_type) === 5) {
            return html`
              <p-tag variant="primary" size="small">
                <p-icon name="bookmark-star"></p-icon>
                Label order
              </p-tag>
            `;
          }
          if (Number(row?.order_type) === 6) {
            return html`
              <p-tag variant="neutral" size="small">
                <p-icon name="tiktok"></p-icon>
                Tiktok order
              </p-tag>
            `;
          }
          if (Number(row?.order_type) === 7) {
            return html`
              <p-tag variant="danger" size="small">
                <p-icon name="ticket-perforated"></p-icon>
                Licensed order
              </p-tag>
            `;
          }
        },
      },
      {
        field: 'order_status',
        id: 'order_status',
        headerName: 'Order status',
        alignItems: 'center',
        justifyContent: 'flex-start',
        render: orderStatusTag,
      },
      // {
      //   field: 'payment_status',
      //   id: 'payment_status',
      //   headerName: 'Payment status',
      //   alignItems: 'center',
      //   justifyContent: 'flex-start',
      //   render: paymentStatusTag,
      // },
      {
        field: 'quantity',
        id: 'quantity',
        headerName: 'Quantity',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      {
        field: 'order_date',
        id: 'order_date',
        headerName: 'Order date',
        minWidth: '120px',
        render: (row: RowData) =>
          html`${dateFormat.from(
            new Date(
              new Date(
                String(row?.created_at),
              ).toLocaleString('en-US', {
                timeZone: 'UTC',
              }),
            ),
            'YYYY-MM-DD',
          )}`,
      },
      {
        field: '',
        id: '',
        headerName: '',
        justifyContent: 'flex-end',
        render: (row: RowData) => html`
          <p-button size="small" variant="primary" outline>
            Support
          </p-button>
        `,
      },
    ],
  },
  orderSummary: {},
  calculateOrderSummary: false,
  loadingExport: false,
  detailModal: false,
  selectedOrder: undefined,
  importModal: false,
  currentPreviewImage: '',
  showPreviewImage: false,
});

const showDetailModal = (row: RowData) => {
  local.selectedOrder = row;
  local.detailModal = true;
};

const showImportModal = () => {
  local.importModal = true;
};

//Only show store information if login as support
if (authStore?.isSupportLogin) {
  local.options.columns?.unshift({
    field: 'store.name',
    id: 'store.name',
    headerName: 'Store name',
    minWidth: '120px',
    alignItems: 'center',
    justifyContent: 'flex-start',
  });
}

const { filters, resetFilter, hasChanged, setFieldValue } =
  useFilter<Filter>(
    reactive({
      page: 1,
      limit: 10,
      key_search: '',
      order_status: '',
      sku: '',
      is_test: -1,
      // is_support_login: undefined,
      order_type: undefined,
      payment_status: undefined,
      order_date_start: '',
      order_date_end: '',
    }),
  );

const handleChangeDate = (e: Event) => {
  const newRange = (e.target as HTMLInputElement).value;
  filters.order_date_start = newRange[0];
  filters.order_date_end = newRange[1];
};

const handleChangePage = (
  e: Event & {
    detail: {
      page: number;
    };
  },
) => {
  filters.page = e?.detail?.page;
  handleFilter();
};

const handleChangeLimit = (
  e: Event & {
    detail: {
      limit: number;
    };
  },
) => {
  filters.page = 1;
  filters.limit = e?.detail?.limit;
  handleFilter();
};

const handleChangeOrderStatus = (e: Event) => {
  setFieldValue('order_status', String(e));
  handleFilter();
};

const handleReset = () => {
  resetFilter();
  //TODO: handle fetch API
  handleFilter();
  loadOrderSummary();
};

const handleSelectOrderType = (e: Event) => {
  //@ts-ignore
  filters.order_type =
    (e.target as HTMLSelectElement).value || [];
};

const handleSelectPaymentStatus = (e: Event) => {
  //@ts-ignore
  filters.payment_status =
    (e.target as HTMLSelectElement).value || '';
};

const handleFilter = async () => {
  try {
    local.loading = true;
    const params = JSON.parse(JSON.stringify(filters));
    if (params.order_status === 'test') {
      params.is_test = 1;
      params.order_status = '';
    } else if (params.order_status === '') {
      params.is_test = -1;
    } else {
      params.is_test = 0;
    }
    const data = await orderStore.orderList(params);
    local.total = data?.total || 0;
    local.items = data?.data || [];
  } catch (error) {
  } finally {
    local.loading = false;
  }
};

const loadOrderSummary = async () => {
  try {
    local.calculateOrderSummary = true;
    const params = JSON.parse(JSON.stringify(filters));
    if (params.hasOwnProperty('order_status')) {
      delete params.order_status;
    }
    const data = await orderStore.orderSummary(params);
    local.orderSummary = data || {};
    local.orderSummary = {
      ...local.orderSummary,
      '': local.orderSummary?.all,
    };
  } catch (error) {
  } finally {
    local.calculateOrderSummary = false;
  }
};

const initialData = async () => {
  try {
    loadOrderSummary();
    handleFilter();
  } catch (error) {}
};

const handleExport = async () => {
  try {
    local.loadingExport = true;
    const params = JSON.parse(JSON.stringify(filters));
    // if (authStore.isSupportLogin) {
    //   params.is_support_login = 1;
    // }
    if (
      !filters.order_date_start ||
      !filters.order_date_end
    ) {
      return toast.show({
        variant: 'primary',
        message: 'Please select date range',
      });
    }
    const rangeDateBySeconds =
      dateFormat
        .to(filters.order_date_end, 'YYYY-MM-DD')
        .getMilliseconds() -
      dateFormat
        .to(filters.order_date_start, 'YYYY-MM-DD')
        .getMilliseconds();
    if (rangeDateBySeconds > 30 * 24 * 60 * 60 * 1000) {
      return toast.show({
        variant: 'primary',
        message: 'Max range date is 30 days',
      });
    }
    params.action = 'export';
    const dataExport = await orderStore.orderList(params);
    if (
      Array.isArray(dataExport) &&
      dataExport.length > 0
    ) {
      const fileName = `${[filters.order_date_start, filters.order_date_end].join('_')}`;
      const filename = `DataOrder_${fileName}.csv`;
      const dataFormat = formatDataExport(dataExport);
      exportToCsv(filename, dataFormat);
    } else {
      toast.show({
        variant: 'warning',
        message: 'No data',
      });
    }
  } catch (error) {
  } finally {
    local.loadingExport = false;
  }
};

initialData();

const handleChangeStore = async () => {
  try {
    loadOrderSummary();
    handleFilter();
  } catch (error) {}
};

const handlePreviewImage = (url?: string) => {
  if (!url) return;
  local.currentPreviewImage = url;
  local.showPreviewImage = true;
};

onMounted(() => {
  EventBus.$on(
    GLOBAL_EVENTS.CHANGE_STORE,
    handleChangeStore,
  );
  EventBus.$on(
    ORDER_EVENTS.PREVIEW_IMAGE,
    handlePreviewImage,
  );
});

onBeforeUnmount(() => {
  EventBus.$off(
    GLOBAL_EVENTS.CHANGE_STORE,
    handleChangeStore,
  );
  EventBus.$off(
    ORDER_EVENTS.PREVIEW_IMAGE,
    handlePreviewImage,
  );
});
</script>

<style scoped lang="scss">
p-button.export-btn::part(base) {
  background-color: #067647 !important;
  border: none !important;
  display: flex !important;
  align-items: center;
}

p-smart-container::part(base) {
  gap: 12px;
}
p-smart-container::part(dropdown-menu) {
  overflow: unset;
  width: 300px;
}
</style>

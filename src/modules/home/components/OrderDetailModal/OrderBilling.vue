<template>
  <div class="relative flex w-full flex-col gap-md">
    <div
      class="relative flex w-full items-center justify-between"
    >
      <div class="flex items-center gap-sm">
        <span
          class="text-sm font-semibold text-gray-900 md:text-base"
        >
          Billing
        </span>
        <p-tag
          v-if="props.data?.payment_status"
          size="small"
          variant="primary"
          class="selected-order--payment-status"
        >
          {{
            PAYMENT_STATUS_LIST?.find(
              (s: PaymentStatus) =>
                s.value === props.data?.payment_status,
            )?.title
          }}
        </p-tag>
      </div>
      <p-dropdown
        v-if="props.data?.newest_paynow_invoice"
        @p-after-hide="
          (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }
        "
        @p-after-show="
          (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          }
        "
      >
        <p-button slot="trigger" caret size="small"
          >Download
          <p-icon
            slot="prefix"
            name="download-01"
            library="custom"
          ></p-icon
        ></p-button>
        <div class="download_menu w-[220px]">
          <p-menu-item
            @click="
              handleExportNowInvoice(
                Number(
                  props.data?.newest_paynow_invoice?.id,
                ),
              )
            "
          >
            <span class="text-sm">Download invoice</span>
            <p-icon
              name="Pdf"
              slot="prefix"
              library="custom"
              style="color: transparent; font-size: 20px"
            ></p-icon>
          </p-menu-item>
          <div class="flex justify-center">
            <a
              href="/receipts"
              target="_blank"
              class="text-sm font-semibold text-brand-600 underline"
            >
              Go to all Invoices
            </a>
          </div>
        </div>
      </p-dropdown>
    </div>

    <div
      class="relative flex w-full flex-1 flex-col items-center justify-between gap-lg rounded-xl border border-gray-200 p-lg pb-lg md:gap-xl md:p-xl"
    >
      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          Blank price
        </span>
        <span class="text-sm font-medium text-gray-900">
          <p-format-number
            type="currency"
            currency="USD"
            :value="Number(billingInfo?.blankPrice) || 0"
            lang="en-US"
          ></p-format-number>
        </span>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          Print price
        </span>
        <span class="text-sm font-medium text-gray-900">
          <p-format-number
            type="currency"
            currency="USD"
            :value="Number(billingInfo?.printPrice) || 0"
            lang="en-US"
          ></p-format-number>
        </span>
      </div>
      <div
        class="relative flex max-h-5 w-full flex-col gap-lg overflow-hidden transition-all duration-500 will-change-auto"
        :class="{
          '!max-h-max': local.showSurcharge,
        }"
      >
        <div
          class="flex w-full items-center justify-between"
        >
          <span
            class="flex cursor-pointer select-none items-center gap-sm text-sm font-medium text-gray-600"
            @click="
              () => {
                local.showSurcharge = !local.showSurcharge;
              }
            "
          >
            <span>Surcharge fee</span>
            <p-icon
              :name="
                local.showSurcharge
                  ? 'chevron-up'
                  : 'chevron-down'
              "
              library="custom"
              class="relative text-base"
            ></p-icon>
          </span>
          <div class="flex items-center gap-sm">
            <!-- <span
              class="text-sm text-gray-700 line-through"
              v-if="billingInfo?.refundSurcharge"
            >
              <p-format-number
                type="currency"
                currency="USD"
                :value="
                  Number(
                    billingInfo?.refundSurchargePrice,
                  ) || 0
                "
                lang="en-US"
              ></p-format-number>
            </span> -->
            <span class="text-sm font-medium text-gray-900">
              <!-- billingInfo?.refundSurcharge ? (Number(
                    billingInfo?.surchargePrice,
                  ) || 0) -
                  (Number(
                    billingInfo?.refundSurchargePrice,
                  ) || 0)
                : Number(billingInfo?.surchargePrice) ||
                  0 -->
              <p-format-number
                type="currency"
                currency="USD"
                :value="
                  Number(billingInfo?.surchargePrice) || 0
                "
                lang="en-US"
              ></p-format-number>
            </span>
          </div>
        </div>
        <template
          v-if="
            Array.isArray(props.data?.surcharge_fee) &&
            props.data?.surcharge_fee.length > 0
          "
        >
          <div
            class="relative flex w-full flex-col gap-sm pl-3xl"
            v-for="(value, key) in props.data
              ?.surcharge_fee"
            :key="key"
          >
            <div
              class="relative flex w-full items-center justify-between font-medium"
            >
              <span
                class="flex cursor-pointer select-none items-center gap-sm text-sm font-medium text-gray-600"
              >
                {{ value?.name ?? '' }}
              </span>
              <div class="flex items-center gap-sm">
                <!-- <span
                  class="text-sm text-gray-700 line-through"
                  v-if="
                    Array.isArray(
                      props.data?.refund_value,
                    ) &&
                    props.data?.refund_value?.includes(
                      String(value?.name),
                    )
                  "
                >
                  <p-format-number
                    type="currency"
                    currency="USD"
                    :value="Number(value?.total) || 0"
                    lang="en-US"
                  ></p-format-number>
                </span> -->
                <span
                  class="text-sm font-medium text-gray-900"
                >
                  <!-- Array.isArray(
                        props.data?.refund_value,
                      ) &&
                      props.data?.refund_value?.includes(
                        String(value?.name),
                      ) ? 0
                        : Number(value?.total) || 0 -->
                  <p-format-number
                    type="currency"
                    currency="USD"
                    :value="Number(value?.total) || 0"
                    lang="en-US"
                  ></p-format-number>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="w-full border-t border-gray-200"></div>
      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          Subtotal
        </span>
        <span class="text-sm font-medium text-gray-900">
          <p-format-number
            type="currency"
            currency="USD"
            :value="Number(billingInfo?.subtotal) || 0"
            lang="en-US"
          ></p-format-number>
        </span>
      </div>
      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          Shipping
        </span>
        <div class="flex items-center gap-sm">
          <span
            class="text-sm text-gray-700 line-through"
            v-if="
              Array.isArray(props.data?.refund_value) &&
              props.data?.refund_value?.includes(
                'shipping_calculate',
              )
            "
          >
            <p-format-number
              type="currency"
              currency="USD"
              :value="
                Number(billingInfo?.shippingPrice) || 0
              "
              lang="en-US"
            ></p-format-number>
          </span>
          <span class="text-sm font-medium text-gray-900">
            <p-format-number
              type="currency"
              currency="USD"
              :value="
                Array.isArray(props.data?.refund_value) &&
                props.data?.refund_value?.includes(
                  'shipping_calculate',
                )
                  ? 0
                  : Number(billingInfo?.shippingPrice) || 0
              "
              lang="en-US"
            ></p-format-number>
          </span>
        </div>
      </div>
      <div class="w-full border-t border-gray-200"></div>

      <div class="flex w-full items-center justify-between">
        <span class="text-sm font-medium text-gray-600">
          Total
        </span>
        <span class="text-sm font-medium text-gray-900">
          <p-format-number
            type="currency"
            currency="USD"
            :value="Number(billingInfo?.totalPrice) || 0"
            lang="en-US"
          ></p-format-number>
        </span>
      </div>
      <div
        class="flex w-full items-center justify-between"
        v-if="
          ['refunded', 'partial_refunded']?.includes(
            String(props.data?.payment_status),
          )
        "
      >
        <span class="text-sm font-medium text-gray-600">
          Refunded
        </span>
        <span class="text-sm font-medium text-gray-900">
          <p-format-number
            type="currency"
            currency="USD"
            :value="Number(billingInfo?.refundValue) || 0"
            lang="en-US"
          ></p-format-number>
        </span>
      </div>
      <template
        v-if="
          ['refunded', 'partial_refunded']?.includes(
            String(props.data?.payment_status),
          )
        "
      >
        <div class="w-full border-t border-gray-200"></div>
        <div
          class="flex w-full items-center justify-between"
        >
          <span class="text-sm font-medium text-gray-600">
            Net payment
          </span>
          <span class="text-sm font-medium text-gray-900">
            <p-format-number
              type="currency"
              currency="USD"
              :value="Number(billingInfo?.netPayment) || 0"
              lang="en-US"
            ></p-format-number>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type {
  Order,
  OrderItem,
  PaymentStatus,
} from '@/modules/home/types';
import { usePaymentStore } from '@/modules/payment/store';
import { PAYMENT_STATUS_LIST } from '@/modules/home/constant';

const paymentStore = usePaymentStore();

interface Props {
  data?: Order;
}

const props = withDefaults(defineProps<Props>(), {
  data: undefined,
});

interface Local {
  showSurcharge: boolean;
}

const local = reactive<Local>({
  showSurcharge: false,
});

const billingInfo = computed(() => {
  let blankPrice = 0;
  let printPrice = 0;
  let handlingFee = 0;

  let subtotal = 0;
  let shippingPrice = 0;
  let surchargePrice = 0;

  let refundValue = 0;
  let refundSurchargePrice = 0;
  let refundSurcharge = false;

  let totalPrice = 0;
  let netPayment = 0;

  if (
    Array.isArray(props.data?.items) &&
    props.data?.items.length > 0
  ) {
    props.data.items.forEach((item: OrderItem) => {
      blankPrice +=
        Number(item.blank_price) * Number(item?.quantity);
      handlingFee +=
        Number(item?.handling_fee) * Number(item?.quantity);
      printPrice +=
        (Number(item?.unit_price) -
          Number(item?.blank_price) -
          Number(item?.handling_fee)) *
        Number(item?.quantity);
    });
  }

  surchargePrice = Array.isArray(props.data?.surcharge_fee)
    ? props.data?.surcharge_fee?.reduce((sum, cur) => {
        // if (
        //   Array.isArray(props.data?.refund_value) &&
        //   props.data?.refund_value?.includes(
        //     String(cur?.name),
        //   )
        // ) {
        //   refundSurcharge = true;
        //   refundSurchargePrice += Number(cur?.total);
        //   refundValue += Number(cur?.total);
        // }
        return sum + Number(cur?.total);
      }, 0)
    : 0;

  subtotal = blankPrice + printPrice + surchargePrice;
  shippingPrice =
    Number(props.data?.shipping_calculate) || 0;

  // if (
  //   Array.isArray(props.data?.refund_value) &&
  //   props.data?.refund_value?.includes('shipping_calculate')
  // ) {
  //   refundValue += shippingPrice;
  // }
  refundValue = Number(props.data?.refund_amount) || 0;

  totalPrice = subtotal + shippingPrice;
  netPayment =
    totalPrice - refundValue > 0
      ? totalPrice - refundValue
      : 0;
  // totalPrice = subtotal + shippingPrice - refundValue;

  return {
    blankPrice,
    printPrice,
    handlingFee,
    subtotal,
    shippingPrice,
    surchargePrice,
    refundValue,
    refundSurcharge,
    refundSurchargePrice,
    totalPrice,
    netPayment,
  };
});

const handleExportNowInvoice = async (id: number) => {
  try {
    const res = await paymentStore.exportNowInvoice(id);
    const data = await fetch(res.data);
    const blob = await data.blob();
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `now_invoice_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {}
};

const selectedOrderPaymentStatusColor = computed(() => {
  return PAYMENT_STATUS_LIST?.find(
    (s: PaymentStatus) =>
      s.value === props.data?.payment_status,
  )?.color;
});
</script>

<style scoped>
.selected-order--payment-status::part(base) {
  background-color: color-mix(
    in srgb,
    var(--p-color-neutral-0) 100%,
    v-bind(selectedOrderPaymentStatusColor) 10%
  );
  color: v-bind(selectedOrderPaymentStatusColor);
  border-color: color-mix(
    in srgb,
    var(--p-color-neutral-0) 100%,
    v-bind(selectedOrderPaymentStatusColor) 40%
  );
}
</style>

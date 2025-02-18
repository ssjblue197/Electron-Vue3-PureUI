import { defineStore } from 'pinia';
import OrderAPI from '@/services/api/order';
import axios from 'axios';
import { getErrorMessage } from '@/utils/helper';
import { useToast } from '@/composables/useToast';
import type {
  Filter,
  SupportForm,
  Order,
} from '@/modules/home/types';
import type { AxiosProgressEvent } from 'axios';

const toast = useToast();

export const useOrderStore = defineStore('order', {
  state: () => {
    return {};
  },
  actions: {
    async orderList(params: Filter) {
      try {
        const { data } = await OrderAPI.list(params);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async orderSummary(params: Partial<Filter>) {
      try {
        const { data } = await OrderAPI.summary(params);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async detail(filter: Filter) {
      try {
        const { data } = await OrderAPI.detail(filter);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async support(payload: SupportForm) {
      try {
        const { data } = await OrderAPI.support(payload);
        toast.show({
          variant: 'success',
          message: 'Request submitted successfully!',
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async cancel(id?: string) {
      try {
        const { data } = await OrderAPI.cancel(String(id));
        toast.show({
          variant: 'success',
          message: 'Cancel order successfully!',
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async importCSVInfo(params: Partial<Filter>) {
      try {
        const { data } =
          await OrderAPI.importCSVInfo(params);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async uploadCSV(
      payload: FormData,
      options?: {
        onUploadProgress?: (
          progressEvent: AxiosProgressEvent,
        ) => void;
      },
    ) {
      try {
        const { data } = await OrderAPI.uploadCSV(
          payload,
          options,
        );
        toast.show({
          variant: 'success',
          message: 'File upload successfully!',
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async updateShippingMethod(payload: Partial<Order>) {
      try {
        const { data } =
          await OrderAPI.updateShippingMethod(payload);
        toast.show({
          variant: 'success',
          message: 'Update shipping method successfully.',
        });
        return {
          isError: false,
          data,
        };
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 422 &&
            [
              'You can only change the shipping method when the order status is New Order, In Production, or Draft.',
              // 'The shipping method cannot be downgraded to a lower shipping tier.',
            ]?.includes(getErrorMessage(error))
          ) {
            return {
              isError: true,
              message: getErrorMessage(error),
            };
          } else {
            toast.show({
              variant: 'danger',
              message: getErrorMessage(error),
            });
            throw error;
          }
        }
      }
    },
    async updateStatus(payload: Partial<Order>) {
      try {
        const { data } =
          await OrderAPI.updateStatus(payload);
        toast.show({
          variant: 'success',
          message: 'Update status successfully.',
        });
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
        throw error;
      }
    },
  },
  persist: {
    storage: localStorage,
    key: 'yt-tools-order-store',
    // paths: [] /*Define states can persisted*/
  },
});

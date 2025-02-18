import { FilterSLA } from '@/modules/insight/types';
import type {
  Filter,
  SupportForm,
  Order,
} from '@/modules/home/types';
import axiosClient from '@/services/api';
import type { AxiosProgressEvent } from 'axios';

export default {
  async statisticSlaOrder(params?: unknown) {
    const response = await axiosClient.get(
      `orders/statistic/sla-order`,
      {
        params,
      },
    );
    return response;
  },
  async getSLAOrderList(params: FilterSLA) {
    const response = await axiosClient.get(
      `orders/list/sla-order`,
      {
        params,
      },
    );
    return response;
  },
  async list(params: Filter) {
    const response = await axiosClient.get(`orders`, {
      params,
    });
    return response;
  },
  async summary(params: Partial<Filter>) {
    const response = await axiosClient.get(
      `orders/summary`,
      {
        params,
      },
    );
    return response;
  },
  async detail(filter: Filter) {
    const { key, ...params } = filter;
    const response = await axiosClient.get(
      `orders/detail/${key}`,
      {
        params,
      },
    );
    return response;
  },
  async support(payload: SupportForm) {
    const response = await axiosClient.post(
      `orders/sent-email`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  },
  async cancel(id: String) {
    const response = await axiosClient.put(
      `orders/cancel-order/${id}`,
    );
    return response;
  },
  async importCSVInfo(params: Partial<Filter>) {
    const response = await axiosClient.get(
      `orders/import-csv`,
      {
        params,
      },
    );
    return response;
  },
  async uploadCSV(
    payload: FormData,
    options?: {
      onUploadProgress?: (
        progressEvent: AxiosProgressEvent,
      ) => void;
    },
  ) {
    const response = await axiosClient.post(
      `orders/upload-csv`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: options?.onUploadProgress,
      },
    );
    return response;
  },
  async updateShippingMethod(payload: Partial<Order>) {
    const response = await axiosClient.post(
      `orders/update-shipping-method`,
      payload,
    );
    return response;
  },
  async updateStatus(payload: Partial<Order>) {
    const response = await axiosClient.put(
      `orders/${payload.encode_id}`,
      {},
    );
    return response;
  },
};

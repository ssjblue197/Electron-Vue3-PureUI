import { defineStore } from 'pinia';
import AuthAPI from '@/services/api/auth';
import axios from 'axios';
import { getErrorMessage } from '@/utils/helper';
import type { User, Form } from '@/modules/auth/types';
import { useToast } from '@/composables/useToast';
import router from '@/router';
import { LAST_ACTIVE_TIMEOUT } from '@/modules/auth/constant';

const toast = useToast();

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      token: null as string | null,
      lastLoginAsSupport: false as boolean,
      lastActive: null as number | null,
      sessionTimeout: null as NodeJS.Timeout | null,
      timeoutDisconnected: false as boolean,
    };
  },
  getters: {},
  actions: {
    async login(payload: Form) {
      try {
        const { data } = await AuthAPI.login(payload);
        this.token = data?.access_token || null;
        this.user = data?.user || null;
        this.timeoutDisconnected = false;
        toast.show({
          variant: 'success',
          message: 'Login successfully',
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
    async logout() {
      try {
        //handle logout
        this.user = null;
        this.token = null;
        this.lastActive = null;
        this.sessionTimeout = null;
        router.push({
          name: 'login',
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
        }
      }
    },
    async me() {
      try {
        const { data } = await AuthAPI.me();
        this.user = data;
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.show({
            variant: 'danger',
            message: getErrorMessage(error),
          });
          throw error;
        }
      }
    },
    async updateLastActive() {
      try {
        this.lastActive = Date.now();
        if (this.sessionTimeout) {
          clearTimeout(this.sessionTimeout);
          this.sessionTimeout = null;
        }
        this.sessionTimeout = setTimeout(() => {
          this.timeoutDisconnected = true;
          toast.show({
            variant: 'primary',
            message: 'Session timeout, please login again',
          });
          this.logout();
        }, LAST_ACTIVE_TIMEOUT);
      } catch (error) {
        throw error;
      }
    },
  },
  persist: {
    storage: localStorage,
    key: 'yt-tools-auth-storage',
    // paths: [] /*Define states can persisted*/
  },
});

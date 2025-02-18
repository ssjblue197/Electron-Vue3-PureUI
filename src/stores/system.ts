import { defineStore, acceptHMRUpdate } from 'pinia';

interface ProcessStatus {
  progress: number;
  isLoading: boolean;
  error: string | null;
}

export const useSystemStore = defineStore('system', {
  state: () => ({
    isCheckNewVersion: false,
    version: 'beta',
    sessionTimeout: null,
    isCollapseSidebar: false as boolean,
    support_login: true as boolean,
    files: {} as Record<string, ProcessStatus>,
  }),
  getters: {},
  actions: {
    initializeFile(fileId: string) {
      this.files[fileId] = {
        progress: 0,
        isLoading: true,
        error: null,
      };
    },
    setProgress(fileId: string, value: number) {
      if (this.files[fileId]) {
        this.files[fileId].progress = value;
      }
    },
    setLoading(fileId: string, isLoading: boolean) {
      if (this.files[fileId]) {
        this.files[fileId].isLoading = isLoading;
      }
    },
    setError(fileId: string, error: string | null) {
      if (this.files[fileId]) {
        this.files[fileId].error = error;
      }
    },
    removeFile(fileId: string) {
      delete this.files[fileId];
    },
  },
  persist: {
    storage: localStorage,
    key: 'yt-tools-system-storage',
    // paths: ['filter', 'total', 'selectRequest'] /*Define states can persisted*/
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useSystemStore, import.meta.hot),
  );
}

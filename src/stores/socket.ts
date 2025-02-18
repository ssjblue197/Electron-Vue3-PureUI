import { defineStore } from 'pinia';

export interface Message {
  title?: String;
  content?: String;
}

export const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      messages: [] as Array<Message>,
    };
  },
  actions: {
    addMessage(message: Message) {
      this.messages.push(message);
    },
  },
  persist: {
    storage: localStorage,
    key: 'yt-tools-socket-store',
    // paths: [] /*Define states can persisted*/
  },
});

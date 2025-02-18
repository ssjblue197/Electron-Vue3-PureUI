import { ipcMain } from 'electron';
import store from '~/stores';

ipcMain.on('get-store', (event, key) => {
  event.returnValue = store.get(key);
});

ipcMain.on('set-store', (_, { key, value }) => {
  store.set(key, value);
});

ipcMain.on('remove-store', (_, key) => {
  store.delete(key);
});

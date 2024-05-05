import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('electronAPI', {
  //Send when one way to connect from Renderer to Main
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  //Invoke when two way to connect from Renderer to Main and wait for response
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  //Receive when one way to connect from Main to Renderer
  onUpdateCounter: (callback: (value: number) => void) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  counterValue: (value: number) => ipcRenderer.send('counter-value', value)
})

import { createApp } from 'vue'
import 'pure-uikit/dist/themes/light.css';
import 'pure-uikit/dist/themes/dark.css';
import './assets/styles/index.scss';
import App from './App.vue'

import { setBasePath } from 'pure-uikit/dist/utilities/base-path.js';
import { registerIconLibrary } from 'pure-uikit/dist/utilities/icon-library.js';
import 'pure-uikit/dist/pure-ui.js';

setBasePath('/public');
registerIconLibrary('custom', {
  resolver: (name: string) => `icons/${name}.svg`, //Public folder after bundle
  mutator: (svg: SVGElement) => {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
  },
});

createApp(App).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})

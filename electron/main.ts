import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
} from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IpcMainEvent } from 'electron';

//@ts-ignore
const require = createRequire(import.meta.url);
const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL =
  process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(
  process.env.APP_ROOT,
  'dist-electron',
);
export const RENDERER_DIST = path.join(
  process.env.APP_ROOT,
  'dist',
);

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function handleSetTitle(
  event: IpcMainEvent,
  title: string,
) {
  //TODO: handle custom title of window when change from UI of application (only example)
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
}

async function handleFileOpen() {
  const { canceled, filePaths } =
    await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(
      process.env.VITE_PUBLIC,
      'electron-vite.svg',
    ),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  //Example to customize Menu native
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () =>
            win?.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () =>
            win?.webContents.send('update-counter', -1),
          label: 'Decrement',
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send(
      'main-process-message',
      new Date().toLocaleString(),
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Open the DevTools.
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  //Add handle for open file (only example)
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.on('set-title', handleSetTitle);
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value); // will print value to Node console
  });

  createWindow();
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

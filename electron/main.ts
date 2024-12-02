import path from 'node:path'
// const path = require('node:path')
import { fileURLToPath } from 'url'
import { app, BrowserWindow, ipcMain } from 'electron'
// const app = require('electron').app
// const BrowserWindow = require('electron').BrowserWindow
// const ipcMain = require('electron').ipcMain
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html
process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      // preload: path.join(MAIN_DIST, 'preload.js')
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
}

function initIpc() {
  ipcMain.handle('app-start-time', () => (new Date()).toLocaleString())
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  initIpc()
  createWindow()
})

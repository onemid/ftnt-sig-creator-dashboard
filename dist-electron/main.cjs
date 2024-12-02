import e from "node:path";
import { app as o, BrowserWindow as i, ipcMain as t } from "electron";
process.env.APP_ROOT = e.join(__dirname, "..");
const r = e.join(process.env.APP_ROOT, "dist-electron"), p = e.join(process.env.APP_ROOT, ".output/public");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? e.join(process.env.APP_ROOT, "public") : p;
let n;
function s() {
  n = new i({
    webPreferences: {
      preload: e.join(r, "preload.js")
    }
  }), process.env.VITE_DEV_SERVER_URL ? (n.loadURL(process.env.VITE_DEV_SERVER_URL), n.webContents.openDevTools()) : n.loadFile(e.join(process.env.VITE_PUBLIC, "index.html"));
}
function c() {
  t.handle("app-start-time", () => (/* @__PURE__ */ new Date()).toLocaleString());
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), n = null);
});
o.on("activate", () => {
  i.getAllWindows().length === 0 && s();
});
o.whenReady().then(() => {
  c(), s();
});
export {
  r as MAIN_DIST,
  p as RENDERER_DIST
};

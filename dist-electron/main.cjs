import e from "node:path";
import { fileURLToPath as s } from "url";
import { app as o, BrowserWindow as i, ipcMain as r } from "electron";
const p = s(import.meta.url), c = e.dirname(p);
process.env.APP_ROOT = e.join(c, "..");
const d = e.join(process.env.APP_ROOT, "dist-electron"), l = e.join(process.env.APP_ROOT, ".output/public");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? e.join(process.env.APP_ROOT, "public") : l;
let n;
function t() {
  n = new i({
    webPreferences: {
      // preload: path.join(MAIN_DIST, 'preload.js')
    }
  }), process.env.VITE_DEV_SERVER_URL ? (n.loadURL(process.env.VITE_DEV_SERVER_URL), n.webContents.openDevTools()) : n.loadFile(e.join(process.env.VITE_PUBLIC, "index.html"));
}
function a() {
  r.handle("app-start-time", () => (/* @__PURE__ */ new Date()).toLocaleString());
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), n = null);
});
o.on("activate", () => {
  i.getAllWindows().length === 0 && t();
});
o.whenReady().then(() => {
  a(), t();
});
export {
  d as MAIN_DIST,
  l as RENDERER_DIST
};

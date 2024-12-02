import e from "node:path";
import { fileURLToPath as r } from "url";
import { app as n, BrowserWindow as i } from "electron";
const t = r(import.meta.url), c = e.dirname(t);
process.env.APP_ROOT = e.join(c, "..");
const E = e.join(process.env.APP_ROOT, "dist-electron"), p = e.join(process.env.APP_ROOT, ".output/public");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? e.join(process.env.APP_ROOT, "public") : p;
let o;
function s() {
  o = new i({
    webPreferences: {
      // preload: path.join(MAIN_DIST, 'preload.js')
    }
  }), process.env.VITE_DEV_SERVER_URL ? o.loadURL(process.env.VITE_DEV_SERVER_URL) : o.loadFile(e.join(process.env.VITE_PUBLIC, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && s();
});
n.whenReady().then(() => {
  s();
});
export {
  E as MAIN_DIST,
  p as RENDERER_DIST
};

import { app, BrowserWindow, protocol } from "electron";
import path from "node:path";
import { __dirname } from "./util.js";
import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

protocol.registerSchemesAsPrivileged([
  {
    scheme: "rsc",
    privileges: {
      secure: true,
      supportFetchAPI: true,
      standard: true,
      stream: true,
    },
  },
]);

app.whenReady().then(() => {
  createWindow();

  protocol.handle("rsc", async (request) => {
    delete require.cache[require.resolve("../dist/server/main.cjs")];
    const Server = require("../dist/server/main.cjs");
    const clientManifest = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../dist/_static/react-client-manifest.json"),
        {
          encoding: "utf-8",
        },
      ),
    );

    return Server.handleRequest(request, clientManifest);
  });

  protocol.handle("file", async (req) => {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/_static")) {
      return new Response(
        await fs.readFile(path.join(__dirname, "../dist", url.pathname)),
        {
          headers: {
            "content-type": "application/javascript",
          },
        },
      );
    }
    return new Response(await fs.readFile(url.pathname));
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "./index.development.html"));

  // if (isDev()) {
  //   win.loadURL("file:/");
  // } else {
  //   win.loadFile(join(__dirname, "../dist/public/index.html"));
  // }
  win.webContents.openDevTools();
}

function isDev() {
  return process.argv[2] == "--dev";
}

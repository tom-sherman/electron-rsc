import { app, BrowserWindow, protocol } from "electron";
import path from "node:path";
import { __dirname, readablefromPipeable } from "./util.js";
import RSDW from "react-server-dom-webpack/server";
const { renderToPipeableStream } = RSDW;
import { createElement } from "react";
import fs from "node:fs/promises";

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
    const Page = await import("../dist/_static/page.mjs");
    const clientManifest = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "../dist/_static/react-client-manifest.json"),
        {
          encoding: "utf-8",
        },
      ),
    );

    console.log(clientManifest);

    const stream = readablefromPipeable(
      renderToPipeableStream(createElement(Page.default), clientManifest),
    );

    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        stream.on("end", () => {
          controller.close();
        });
      },
    });

    return new Response(readable);
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

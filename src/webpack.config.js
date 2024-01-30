import path from "node:path";
import { __dirname } from "./util.js";
import {
  WebpackRscClientPlugin,
  WebpackRscServerPlugin,
  createWebpackRscClientLoader,
  createWebpackRscServerLoader,
  createWebpackRscSsrLoader,
  webpackRscLayerName,
} from "@mfng/webpack-rsc";

const clientReferencesMap = new Map();
const serverReferencesMap = new Map();
const rscServerLoader = createWebpackRscServerLoader({ clientReferencesMap });
const rscSsrLoader = createWebpackRscSsrLoader();
const rscClientLoader = createWebpackRscClientLoader({ serverReferencesMap });

const swcOptions = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
      jsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
};

/**
 * @type {import("webpack").Configuration}
 */
const serverConfig = {
  name: "server",
  mode: "development",
  entry: {
    server: {
      filename: "main.cjs",
      import: path.join(__dirname, "./framework/server.tsx"),
    },
  },
  target: "node",
  output: {
    path: path.join(__dirname, "../dist/server"),
    library: {
      type: "commonjs-static",
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        resource: /\/framework\/server\.tsx$/,
        layer: webpackRscLayerName,
      },
      {
        issuerLayer: webpackRscLayerName,
        resolve: { conditionNames: ["react-server"] },
      },
      {
        oneOf: [
          {
            issuerLayer: webpackRscLayerName,
            test: /\.tsx?$/,
            use: [
              rscServerLoader,
              {
                loader: "swc-loader",
                options: swcOptions,
              },
            ],
          },
          {
            test: /\.tsx?$/,
            use: [
              rscSsrLoader,
              {
                loader: "swc-loader",
                options: swcOptions,
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackRscServerPlugin({ clientReferencesMap, serverReferencesMap }),
  ],
  experiments: { layers: true },
};

const clientConfig = {
  name: "client",
  mode: "development",
  dependencies: ["server"],
  entry: path.join(__dirname, "./framework/client.tsx"),
  target: "web",
  output: {
    path: path.join(__dirname, "../dist/_static"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          rscClientLoader,
          {
            loader: "swc-loader",
            options: swcOptions,
          },
        ],
      },
    ],
  },
  plugins: [new WebpackRscClientPlugin({ clientReferencesMap })],
};

export default [serverConfig, clientConfig];

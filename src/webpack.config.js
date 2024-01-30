import path from "node:path";
import { __dirname } from "./util.js";
import ReactFlightWebpackPlugin from "react-server-dom-webpack/plugin";

/**
 * @type {import("webpack").Configuration}
 */
export default {
  mode: "development",
  entry: {
    main: path.join(__dirname, "../app/main.tsx"),
    page: path.join(__dirname, "../app/page.tsx"),
  },
  target: "web",
  output: {
    path: path.join(__dirname, "../dist/_static"),
    libraryTarget: "module",
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: "swc-loader",
        options: {
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
        },
      },
    ],
  },
  plugins: [
    new ReactFlightWebpackPlugin({
      isServer: false,
      clientReferences: {
        directory: path.join(__dirname, "../app"),
        recursive: true,
        include: /\.(js|ts|jsx|tsx)$/,
      },
    }),
  ],
};

declare module "react-server-dom-webpack" {}

declare module "react-server-dom-webpack/client" {
  import { ReactNode } from "react";

  export function createFromFetch(
    response: Promise<Response>,
  ): Promise<ReactNode>;
}

declare module "react-server-dom-webpack/server" {
  import { ReactNode } from "react";
  import { Writable } from "node:stream";

  export function renderToPipeableStream(
    node: ReactNode,
    manifest: any,
  ): {
    abort(reason: any): void;
    pipe(destination: Writable): Writable;
  };
}

declare module "react-server-dom-webpack/plugin" {
  import type webpack from "webpack";
  export default class ReactFlightWebpackPlugin {
    constructor(options: {
      isServer?: boolean;
      clientReferences?: {
        directory: string;
        recursive: boolean;
        include: RegExp;
      };
    });

    apply(compiler: webpack.Compiler): void;
  }
}

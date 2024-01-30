declare module "react-server-dom-webpack" {}

declare module "react-server-dom-webpack/client" {
  import { ReactNode } from "react";
  export interface ReactServerDomClientOptions {
    callServer?: CallServerCallback;
  }

  export type CallServerCallback = (id: string, args: any) => Promise<unknown>;

  export function createFromFetch(
    promiseForResponse: Promise<Response>,
    options?: ReactServerDomClientOptions,
  ): Promise<ReactNode>;

  export function createFromReadableStream<T>(
    stream: ReadableStream,
    options?: ReactServerDomClientOptions,
  ): Promise<T>;

  export function encodeReply(value: any): Promise<string | FormData>;

  export function createServerReference(
    id: string,
    callServer: CallServerCallback,
  ): (...args: unknown[]) => Promise<unknown>;
}

declare module "react-server-dom-webpack/server" {
  import { ReactNode } from "react";
  import { Writable } from "node:stream";

  export type PipeableStream = {
    abort(reason: any): void;
    pipe(destination: Writable): Writable;
  };

  export function renderToPipeableStream(
    node: ReactNode,
    manifest: any,
  ): PipeableStream;
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

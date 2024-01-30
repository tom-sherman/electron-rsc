import { Transform } from "stream";
import Page from "../../app/page";
import {
  renderToPipeableStream,
  type PipeableStream,
} from "react-server-dom-webpack/server";
import { ComponentType } from "react";

export async function handleRequest(
  request: Request,
  clientManifest: any,
): Promise<Response> {
  if (request.method === "GET") {
    return new Response(renderToReadableStream(Page, clientManifest), {
      headers: {
        "content-type": "text/x-component",
      },
    });
  }

  if (request.method === "POST") {
    // TODO: Handle action
    throw new Error("POST not implemented");
  }

  throw new Error(`Invalid request method ${request.method}`);
}

function renderToReadableStream(Component: ComponentType, clientManifest: any) {
  const stream = readablefromPipeable(
    renderToPipeableStream(<Component />, clientManifest),
  );

  return new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      stream.on("end", () => {
        controller.close();
      });
    },
  });
}

export const readablefromPipeable = (stream: PipeableStream) =>
  stream.pipe(createNoopStream());

export const createNoopStream = () =>
  new Transform({
    transform(chunk, _encoding, callback) {
      this.push(chunk);
      callback();
    },
  });

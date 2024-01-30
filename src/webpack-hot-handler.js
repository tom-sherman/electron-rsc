import createWebpackDevMiddleware from "webpack-hot-middleware";

/**
 *
 * @param {import("webpack").Compiler} compiler
 * @returns {(req: Request) => Promise<Response>}
 */
export function createWebpackHotMiddleware(
  compiler,
  {
    log = console.log.bind(console),
    path = "/__webpack_hmr",
    heartbeat = 10 * 1000,
  } = {},
) {
  const middleware = createWebpackDevMiddleware(compiler, {
    log,
    path,
    heartbeat,
  });

  return async (req) => {};
}

/**
 * @param {Request} req
 */
function createShimmedRequest(req) {
  const headers = Object.fromEntries(req.headers.entries());

  return {
    httpVersion: 1.1,
  };
}

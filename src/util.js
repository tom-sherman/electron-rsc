import path from "node:path";
import { Transform } from "node:stream";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/**
 *
 * @returns {Transform}
 */
export const readablefromPipeable = (stream) => stream.pipe(createNoopStream());

export const createNoopStream = () =>
  new Transform({
    transform(chunk, _encoding, callback) {
      this.push(chunk);
      callback();
    },
  });

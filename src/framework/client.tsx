/// <reference types="react/experimental" />
import { createFromFetch } from "react-server-dom-webpack/client";
import { createRoot } from "react-dom/client";
import { ReactNode, Usable, use } from "react";

function Root({ children }: { children: Usable<ReactNode> }) {
  return use(children);
}

const root = createRoot(document.getElementById("app")!);

root.render(<Root>{createFromFetch(fetch("rsc://rsc"))}</Root>);

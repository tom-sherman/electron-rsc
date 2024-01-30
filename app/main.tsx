import { createFromFetch } from "react-server-dom-webpack/client";
import { createRoot } from "react-dom/client";
import { ReactNode } from "react";

console.log("hello");

function Shell({ children }: { children: ReactNode }) {
  return <div id="shell">children: {children}</div>;
}

const root = createRoot(document.getElementById("app")!);

createFromFetch(fetch("rsc://rsc")).then((res) => {
  root.render(<Shell>{res}</Shell>);
});

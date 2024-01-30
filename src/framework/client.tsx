import { createFromFetch } from "react-server-dom-webpack/client";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("app")!);

createFromFetch(fetch("rsc://rsc")).then(root.render);

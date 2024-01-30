"use client";

import { useState } from "react";

export function Client({ data }: { data: string }) {
  const [count, setCount] = useState(0);
  return (
    <div id="client" onClick={() => setCount(count + 1)}>
      <p>Got data: {data}</p>
      <div>Client</div>
      <div>Count: {count}</div>
    </div>
  );
}

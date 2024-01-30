import { Suspense } from "react";
import { Client } from "./client";

export default async function Page() {
  return (
    <>
      <p>anotheraaaa</p>
      <Client data={process.platform} />
      <Suspense fallback={<p>Loading...</p>}>
        <Delayed />
      </Suspense>
    </>
  );
}

async function Delayed() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return <p>Delayed</p>;
}

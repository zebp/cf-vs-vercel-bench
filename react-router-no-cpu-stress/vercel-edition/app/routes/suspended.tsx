import type { Route } from "./+types/suspended";
import { Welcome } from "../welcome/welcome";
import { Suspense, use } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const messagePromise = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(Math.random().toString());
    }, 200);
  });
  return { messagePromise };
}

export default function Suspended({ loaderData }: Route.ComponentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Inner messagePromise={loaderData.messagePromise} />
    </Suspense>
  );
}

function Inner({ messagePromise }: { messagePromise: Promise<string> }) {
  const message = use(messagePromise);
  return <Welcome message={message} />;
}

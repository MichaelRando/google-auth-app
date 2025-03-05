import type {Route} from ".react-router/types/app/routes/+types/home";
import {getSession} from "~/sessions.server";

export async function loader(loaderArgs: Route.LoaderArgs) {
  const session = await getSession(
    loaderArgs.request.headers.get("cookie")
  );

  console.log(`home session ${session.get("email")}`)
}

export default function({ loaderData, actionData  }: Route.ComponentProps) {
  return <div>HOME</div>;
}
import type {Route} from ".react-router/types/app/routes/+types/login";
import {destroySession, getSession} from "~/sessions.server";
import {redirect} from "react-router";

export async function loader(loaderArgs: Route.LoaderArgs) {
  const request = loaderArgs.request;
  const session = await getSession(request.headers.get("cookie"));
  console.log(`hw session ${session.data.email}`)
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    },
  });
}

export default function({ loaderData, actionData  }: Route.ComponentProps) {
  return <div>Hello World</div>;
}
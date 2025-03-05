import type {Route} from "./+types/base";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Outlet, redirect} from "react-router";
import {getSession} from "~/sessions.server";



export async function loader(loaderArgs: Route.LoaderArgs) {
  const session = await getSession(
    loaderArgs.request.headers.get("cookie")
  );
  var url = new URL(loaderArgs.request.url);
  console.log(`base loader session ${session.data?.email} url: ${url.pathname}`)

  if (!session.has("email") && url.pathname != "/") {
    // Redirect to the login default if there's no approved email
    return redirect("/");
  }

  return {clientId: loaderArgs.context.CLIENT_ID};
}

export default function base({ loaderData, params }: Route.ComponentProps) {
  return (
    <GoogleOAuthProvider clientId={loaderData.clientId}>
      <Outlet />
    </GoogleOAuthProvider>
  );
}
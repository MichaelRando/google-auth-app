import type {Route} from "./+types/base";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Outlet} from "react-router";



export function loader(loaderArgs: Route.LoaderArgs) {
  return {clientId: loaderArgs.context.CLIENT_ID};
}

export default function base({ loaderData, params }: Route.ComponentProps) {
  return (
    <GoogleOAuthProvider clientId={loaderData.clientId}>
      <Outlet />
    </GoogleOAuthProvider>
  );
}
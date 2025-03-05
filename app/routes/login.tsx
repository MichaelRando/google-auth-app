import type {Route} from "./+types/login";
import {useGoogleLogin} from '@react-oauth/google';
import {redirect, useNavigate, data, useFetcher} from "react-router";
import {OAuth2Client} from "google-auth-library";
import {useEffect} from "react";
import {commitSession, getSession} from "~/sessions.server";

export async function loader(loaderArgs: Route.LoaderArgs) {
  const request = loaderArgs.request;
  const session = await getSession(request.headers.get("cookie"));
  console.log(`login loader session ${session.get("email")}`)
  return data(
    {error: session.get("error")},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function action(actionArgs: Route.ActionArgs) {
  const request = actionArgs.request;
  const session = await getSession(
    request.headers.get("cookie")
  );
  console.log(`action session ${session.get("email")}`)
  if (session.get("email")) {
    redirect("home");
  }

  const requestJson = await request.json();
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage',
  );
  const code = requestJson.code;
  const {tokens} = await oAuth2Client.getToken(requestJson.code); // exchange code for tokens
  if (tokens?.id_token) {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });
    if (ticket) {
      const payload = ticket.getPayload();
      if (payload?.email_verified) {
        const APPROVED_EMAILS = process.env.USERS?.split(',') ?? [];
        if (payload?.email && APPROVED_EMAILS.includes(payload?.email)) {
          session.set("email", payload.email);
          return redirect("home", {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          });
        } else {
          return {
            error: "Email not on the approved user list... please contact <PERSON>"
          }
        }
      }
    }
  }
}

export default function Login({loaderData}: Route.ComponentProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.route) {
      navigate(fetcher.data.route);
    }
  }, [fetcher.data]);
  const googleLogin = useGoogleLogin({
    onSuccess: async ({code}) => {
      await fetcher.submit({code}, {
        method: "post",
        encType: "application/json"
      });
    },
    flow: 'auth-code',
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={googleLogin}>Login with Google</button>
      </div>
      {loaderData.error && <div className="text-red-500">{loaderData.error}</div>}
    </div>
  );
}

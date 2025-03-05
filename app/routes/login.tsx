import type {Route} from "./+types/login";
import {useGoogleLogin} from '@react-oauth/google';
import {useFetcher, useNavigate} from "react-router";
import {OAuth2Client} from "google-auth-library";
import {useEffect} from "react";

export async function action(actionArgs: Route.ActionArgs) {
  const request = actionArgs.request;
  const data = await request.json();
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage',
  );
  const code = data.code;
  const {tokens} = await oAuth2Client.getToken(data.code); // exchange code for tokens
  if (tokens?.id_token) {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });
    if (ticket) {
      const payload = ticket.getPayload();
      if (payload?.email_verified) {
        return {route: "home"};
      }
    }
  }
}

export default function Login({loaderData, actionData}: Route.ComponentProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data && fetcher.data.route) {
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
    <div className="flex items-center justify-center">
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={googleLogin}>Login with Google</button>
    </div>
  );
}

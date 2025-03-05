import { createCookieSessionStorage } from "react-router";

type SessionData = {
  email: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      cookie: {
        name: "__session",
        httpOnly: true,
        path: "/",
        maxAge: 60,
        secure: true,
        secrets: [process.env.COOKIE_SECRET!],
      },
    }
  );

export { getSession, commitSession, destroySession };

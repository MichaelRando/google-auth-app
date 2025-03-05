import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import {AppLoadContext} from "react-router";

declare module "react-router" {
  interface AppLoadContext {
    CLIENT_ID: string;
  }
}

export const app = express();

app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext(): AppLoadContext {
      return {
        CLIENT_ID: process.env.CLIENT_ID ?? "",
      };
    },
  })
);

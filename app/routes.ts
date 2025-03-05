import {type RouteConfig, index, route, layout} from "@react-router/dev/routes";



export default [
  layout("base.tsx", [
    index("routes/login.tsx"),
    route("home", "routes/home.tsx")
  ]),
] satisfies RouteConfig;

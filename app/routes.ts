import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/rootLayout.tsx", [
    index("routes/home.tsx"),
    route("signup", "routes/signup.tsx"),
    route("contact", "routes/contact.tsx"),
    route("testing", "routes/testing.tsx"),
    route("login", "routes/login.tsx"),
    // route("kitchens", "routes/kitchens/index.tsx", [
    //   route(":kitchenhandle", "routes/kitchens/kitchen.tsx"),
    // ]),

    route("kitchens", "routes/kitchens/index.tsx"),
    route("kitchens/:slug", "routes/kitchens/kitchen.tsx"),

    route("bathrooms", "routes/bathrooms/index.tsx"),
    route("bathrooms/:slug", "routes/bathrooms/bathroom.tsx"),

    // layout("components/loggedWrapper.tsx", [index("routes/dashboard.tsx")]),
    layout("components/loggedWrapper.tsx", [
      route("dashboard", "routes/dashboard.tsx"),
    ]),
  ]),

  // layout("components/loggedWrapper.tsx", [index("routes/dashboard.tsx")]),
] satisfies RouteConfig;

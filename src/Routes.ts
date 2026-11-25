export const ROUTES = {
  FEED: "/feed",
  ADD: "/add",
  SIGNS: "/signs",
  LOGIN: "/login",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: "Лента",
  ADD: "Добавление",
  SIGNS: "Плитка",
  LOGIN: "Вход",
};

import "./BottomNav.css";
import type { FC, ReactNode } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, type RouteKeyType } from "../../Routes";

interface NavItem {
  key: RouteKeyType;
  enabled: boolean;
  icon: ReactNode;
}

// Гостю доступны только «Лента» и «Плитка»
const NAV_ITEMS: NavItem[] = [
  {
    key: "FEED",
    enabled: true,
    icon: <path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4v-6H9v6H5a2 2 0 01-2-2z" />,
  },
  {
    key: "ADD",
    enabled: false,
    icon: <path d="M12 5v14M5 12h14" />,
  },
  {
    key: "SIGNS",
    enabled: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    key: "LOGIN",
    enabled: false,
    icon: (
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    ),
  },
];

export const BottomNav: FC = () => (
  <Nav as="nav" className="bottom-nav">
    {NAV_ITEMS.map(({ key, enabled, icon }) => {
      const svg = <svg viewBox="0 0 24 24">{icon}</svg>;

      return enabled ? (
        <Nav.Link
          key={key}
          as={NavLink}
          to={ROUTES[key]}
          className="nav-btn"
          aria-label={ROUTE_LABELS[key]}
          title={ROUTE_LABELS[key]}
        >
          {svg}
        </Nav.Link>
      ) : (
        <Nav.Link
          key={key}
          disabled
          className="nav-btn"
          aria-label={`${ROUTE_LABELS[key]} (недоступно)`}
          title={`${ROUTE_LABELS[key]} — недоступно гостю`}
        >
          {svg}
        </Nav.Link>
      );
    })}
  </Nav>
);

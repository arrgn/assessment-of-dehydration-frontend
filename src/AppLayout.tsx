import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./components/BottomNav/BottomNav";

/** Общая оболочка: «телефон» с контентом страницы и нижней навигацией */
export const AppLayout: FC = () => (
  <div className="phone">
    <Outlet />
    <BottomNav />
  </div>
);

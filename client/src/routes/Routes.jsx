import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import SchedulePage from "../pages/SchedulePage";
import BudgetPage from "../pages/BudgetPage";
import PlannerPage from "../pages/PlannerPage";
import ExamPage from "../pages/ExamPage";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/schedule",
        Component: SchedulePage,
      },
      {
        path: "/budget",
        Component: BudgetPage,
      },
      {
        path: "/planner",
        Component: PlannerPage,
      },
      {
        path: "/exam",
        Component: ExamPage,
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../components/Home";
import SchedulePage from "../pages/SchedulePage";
import BudgetPage from "../pages/BudgetPage";
import PlannerPage from "../pages/PlannerPage";
import ExamPage from "../pages/ExamPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
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

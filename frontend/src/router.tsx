import { createBrowserRouter, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CatDetail from "./pages/CatDetail";
import Advisor from "./pages/Advisor";
import AgentChat from "./pages/AgentChat";
import AddCat from "./pages/AddCat";
import Favorites from "./pages/Favorites";
import RequireAuth from "./components/RequireAuth";
import { ArrowLeft } from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cats/:id", element: <CatDetail /> },
      {
        path: "advisor",
        element: (
          <RequireAuth>
            <Advisor />
          </RequireAuth>
        ),
      },
      {
        path: "agent",
        element: (
          <RequireAuth>
            <AgentChat />
          </RequireAuth>
        ),
      },
      {
        path: "add",
        element: (
          <RequireAuth>
            <AddCat />
          </RequireAuth>
        ),
      },
      {
        path: "favorites",
        element: (
          <RequireAuth>
            <Favorites />
          </RequireAuth>
        ),
      },
      {
        path: "*",
        element: (
          <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
            <h1 className="text-4xl font-bold text-on-surface">404</h1>
            <p className="text-outline text-sm">The requested feline page does not exist.</p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold shadow-md"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Browse
            </Link>
          </div>
        ),
      },
    ],
  },
]);

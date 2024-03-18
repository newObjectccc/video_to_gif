import PageA from "@pages/pageA";
import PageB from "@pages/pageB";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    children: [
      { index: true, element: <Navigate to="pageA" /> },
      { path: "pageA", element: <PageA /> },
      { path: "pageB", element: <PageB /> },
    ],
  },
];

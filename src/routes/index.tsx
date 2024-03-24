import Main from "@src/pages/Main";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    children: [
      { index: true, element: <Navigate to="main" /> },
      { path: "main", element: <Main /> },
    ],
  },
];

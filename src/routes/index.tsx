import Main from "@src/pages/Main";
import { OperationView } from "@src/pages/OperationView";

export const routes = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/edit",
    element: <OperationView />,
  },
];

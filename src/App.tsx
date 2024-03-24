import Layout from "@src/components/Layout";
import { routes } from "@src/routes";
import { useRoutes } from "react-router-dom";

const App = () => {
  const routesElem = useRoutes(routes);
  return (
    <div className="content">
      <Layout>{routesElem}</Layout>
    </div>
  );
};

export default App;

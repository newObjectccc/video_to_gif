import { routes } from "@src/routes";
import { Link, useRoutes } from "react-router-dom";

const App = () => {
  const routesElem = useRoutes(routes);
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <section className="border border-cyan-200 p-8 w-52 mx-auto my-8">
        {routesElem}
      </section>
      <div className="flex justify-center">
        <Link className="mr-8" to="/pageA">
          Navigate to pageA
        </Link>
        <Link to="/pageB">Navigate to pageB</Link>
      </div>
    </div>
  );
};

export default App;

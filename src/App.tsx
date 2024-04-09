import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { InfoCard } from "@src/components/InfoCard";
import { TransformStateProvider } from "@src/contexts/TransformProvider";
import { routes } from "@src/routes";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation, useRoutes } from "react-router-dom";
import logo from "../public/iconLg-48x48px.png";

const App = () => {
  const routesElem = useRoutes(routes);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  return (
    <TransformStateProvider>
      <div className="flex flex-row flex-nowrap items-center justify-between px-6 pt-4 font-semibold text-2xl">
        <div className="flex flex-row items-center gap-4">
          <img src={logo} alt="v2g" />
          V2G -<span className="font-normal text-lg">video to gif</span>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-2">
          <Palette />
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">主题切换</p>
          </div>
          <div className="flex items-center">
            <Switch
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
          </div>
        </div>
      </div>
      <Separator className="my-4"></Separator>
      <div className="flex flex-row flex-nowrap w-full">
        {location.pathname === "/" ? (
          <InfoCard className="rounded-lg ml-4 mt-1 flex flex-col flex-nowrap"></InfoCard>
        ) : null}
        <div className="w-full">{routesElem}</div>
      </div>
      <Toaster />
    </TransformStateProvider>
  );
};

export default App;

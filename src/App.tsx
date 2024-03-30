import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { InfoCard } from "@src/components/InfoCard";
import {
  TransformStateIntf,
  defaultTransformState,
  transformDispatch,
} from "@src/components/TransformProvider";
import { routes } from "@src/routes";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import React, { Dispatch, useReducer } from "react";
import { useRoutes } from "react-router-dom";
import logo from "../public/iconLg-48x48px.png";

export const TransformStateContext = React.createContext<
  [TransformStateIntf, Dispatch<typeof transformDispatch>]
>([defaultTransformState, () => {}]);

const App = () => {
  const [state, dispatch] = useReducer(
    transformDispatch,
    defaultTransformState
  );
  const routesElem = useRoutes(routes);
  const { theme, setTheme } = useTheme();
  return (
    <TransformStateContext.Provider value={[state, dispatch as any]}>
      <div className="flex flex-row flex-nowrap items-center justify-between px-6 pt-4 font-semibold text-2xl">
        <div className="flex flex-row items-center gap-4">
          <img src={logo} alt="v2g" />
          V2G -<span className="font-normal text-lg">video to gif</span>
        </div>
        <div className="flex items-center space-x-4 rounded-md border p-4">
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
        <InfoCard className="rounded-lg m-4 flex flex-col flex-nowrap"></InfoCard>
        <div className="w-full">{routesElem}</div>
      </div>
      <Toaster />
    </TransformStateContext.Provider>
  );
};

export default App;

import { defineConfig } from "@rsbuild/core";
import { mergeRsbuildConfig } from "@rsbuild/core";
import baseOptions from "./rsbuild.base.config";

const devOptions = defineConfig({
  plugins: [],
});

export default mergeRsbuildConfig(baseOptions, devOptions);

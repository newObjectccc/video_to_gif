import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

export default defineConfig({
  source: {
    aliasStrategy: "prefer-tsconfig", // 'prefer-tsconfig' | 'prefer-alias'
    // 装饰器语法版本
    decorators: {
      version: "2022-03", // 'legacy' | '2022-03'
    },
  },
  html: {
    template: "./public/index.html",
  },
  plugins: [
    /**
     * [pluginReact description]
     *
     * React 插件提供了对 React 的支持，插件内部集成了 JSX 编译、React Refresh 等功能。
     * 默认情况下，Rsbuild 使用 React 17 引入的新版本 JSX runtime。
     *
     * 更多内容请参考官方文档 https://rsbuild.dev/zh/plugins/list/plugin-react
     */
    pluginReact(),
    /**
     * [pluginTypeCheck description]
     *
     * 以下配置理论上不需要修改，保留默认设置即可。
     * 如果项目开启了 ts-loader，并且手动配置了 compileOnly: false，请关闭 Type Check 插件，避免重复类型检查。
     * 在 VS Code 等 IDE 中会将部分 error 显示成 warning，但在 fork-ts-checker-webpack-plugin 检查中仍会显示为 error
     * fork-ts-checker-webpack-plugin 不支持检查 .vue 组件中的 TypeScript 代码，如果你用的 vue，请参考官方文档
     *
     * 更多内容请参考官方文档 https://rsbuild.dev/zh/plugins/list/plugin-type-check
     */
    pluginTypeCheck({
      // enable: true, //是否开启 TypeScript 类型检查，默认开启。
      // forkTsCheckerOptions: {}, //fork-ts-checker-webpack-plugin 配置项 https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#readme。
    }),
  ],
});

import { defineConfig, mergeRsbuildConfig } from "@rsbuild/core";
import { pluginCheckSyntax } from "@rsbuild/plugin-check-syntax";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import baseOptions from "./rsbuild.base.config";

const prodOptions = defineConfig({
  output: {
    dataUriLimit: {
      svg: 8 * 1024, // 8kb
      image: 8 * 1024, // 8kb
    },
    // filenameHash: "contenthash",
    filename: {
      js: "js/[name].[contenthash:8].js",
      css: "css/[name].[contenthash:8].css",
      media: "media/[name].[contenthash:8].[ext]",
      font: "font/[name].[contenthash:8].[ext]",
      image: "image/[name].[contenthash:8].[ext]",
      svg: "svg/[name].[contenthash:8].[ext]",
    },
    minify: {
      js: true,
      jsOptions: {
        compress: {
          drop_console: true,
        },
      },
      css: true,
      html: true,
    },
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
     * [pluginImageCompress description]
     *
     * 插件接受一系列压缩器配置项组成的数组，数组的每一项既可以是字符串也可以是对象。
     * 字符串代表使用对应名称的压缩器并启用其默认配置，
     * 或是使用对象格式配置并在 use 字段指定压缩器，对象的剩余字段将作为压缩器的配置项。
     * 配置项列表最终会转换成对应的 bundler loader 配置，因此压缩器也遵循从下到上依次匹配的规则，和webpack loader一样。
     * 插件默认会开启 jpeg, png, ico 三种图片压缩器
     * 默认的 png 压缩器为有损压缩，如果需要将其替换为无损压缩器
     * 可以将 ['jpeg', 'png', 'ico'] 替换为 ['jpeg', 'pngLossless', 'ico']
     *
     * 更多内容请参考官方文档 https://rsbuild.dev/zh/plugins/list/plugin-image-compress
     */
    pluginImageCompress([
      { use: "jpeg", test: /\.(?:jpg|jpeg|jpe)$/ },
      { use: "pngLossless", test: /\.(?:png|apng)$/ },
      "ico",
    ]),
    /**
     * [pluginCheckSyntax description]
     *
     * Check Syntax 插件用于分析构建产物中是否存在当前浏览器范围下不兼容的高级语法。如果存在，会将详细信息打印在终端。
     * TIP
     * 目前语法检测是基于 AST parser 来实现的，每次检测时，只能找出文件中的第一个不兼容语法。
     * 如果一个文件中存在多个不兼容语法，你需要修复已发现的语法，并重新执行检测。
     * 如果日志中没有显示对应的源码位置，可以尝试将 output.disableMinimize 设置为 true 后再重新构建。
     * 一般来说使用默认设置就好，不需要额外配置。
     * 当前项目 package.json 中的 browserslist 配置会被用于检测，如果你需要更改检测的目标浏览器，可以通过 targets 字段进行配置。
     *
     * 更多内容请参考官方文档 https://rsbuild.dev/zh/plugins/list/plugin-check-syntax
     */
    pluginCheckSyntax({
      // targets: ["chrome >= 58", "firefox >= 57", "safari >= 10", "edge >= 16", "ie >= 11"],
      // exclude: /node_modules\/**/,
      // ecmaVersion: 2022, //指定要使用的 ECMAScript 版本，默认会基于target自动分析。
    }),
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

export default mergeRsbuildConfig(prodOptions, baseOptions);

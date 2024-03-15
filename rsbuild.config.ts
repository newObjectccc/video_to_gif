import { defineConfig } from "@rsbuild/core";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";
import { pluginCheckSyntax } from "@rsbuild/plugin-check-syntax";

export default defineConfig({
  plugins: [
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
     *
     */
    pluginCheckSyntax(),
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

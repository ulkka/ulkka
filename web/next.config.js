const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "@react-navigation/drawer",
  "@react-navigation/material-top-tabs",
  "@react-navigation/native",
  "@react-navigation/stack",
  "react-native-status-bar-height",
  "react-native-tab-view",
  "react-native-screens",
  "react-native-reanimated",
  "react-native-elements",
  "react-native-gesture-handler",
  "react-native-vector-icons",
  "react-native-safe-area-context",
  "react-native-iphone-x-helper",
  "react-native-size-matters",
  "react-native-ratings",
  "react-native-video",
  "react-native-image-crop-picker",
  "react-native-image-crop-picker",
  "react-native-collapsible",
  "react-native-splash-screen"
]);
const webpack = require("webpack");
const path = require("path");
module.exports = withPlugins([withTM], {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];

    config.module.rules.push({
      test: /\.(j|t)sx?$/,
      // exclude: [/node_modules/],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              // 'react-native',
              "next/babel",
              "@babel/preset-env",
              "@babel/preset-flow",
              "@babel/preset-react",
              // "module:metro-react-native-babel-preset",
            ],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread",
              ["react-native-web", { commonjs: true }],
            ],
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.ttf$/,
      loader: "url-loader", // or directly file-loader
      include: path.resolve(
        __dirname,
        "node_modules/react-native-vector-icons"
      ),
    });

    // This is needed for webpack to import static images in JavaScript files
    const imgLoader = {
      test: /\.(gif|jpe?g|png)$/,
      use: {
        loader: "url-loader",
        options: {
          useRelativePath: false,
          name: "[sha512:hash:base62:5].[ext]",
          limit: 4096,
          outputPath: "img/",
          publicPath: "/",
        },
      },
    };

    config.module.rules.push(imgLoader);
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
        __DEV__: process.env.NODE_ENV === "production" || true,
      })
    );
    return config;
  },
});

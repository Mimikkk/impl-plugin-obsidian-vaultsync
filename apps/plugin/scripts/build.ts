import { rspack } from "@rspack/core";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

rspack({
  entry: "./src/main.ts",
  output: {
    path: resolve("dist"),
    clean: true,
    filename: "main.js",
    cssFilename: "styles.css",
    library: { type: "commonjs-static" },
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    alias: {
      "@env": resolve(".env"),
      "@nimir/shared": resolve("../../libs/shared/src/mod.ts"),
    },
  },
  cache: true,
  externals: ["obsidian"],
  module: {
    rules: [
      { test: /\.css$/, type: "css" },
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        type: "javascript/auto",
        options: {
          jsc: {
            parser: { syntax: "typescript" },
            target: "esnext",
          },
        },
      },
      {
        test: /\.env$/,
        loader: "./scripts/env-loader.ts",
        type: "json",
      },
    ],
  },
  stats: "normal",
  mode: "production",
}).run(async (error, stats) => {
  if (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }

  if (stats?.hasErrors()) {
    console.error("Build completed with errors:", stats.toString({ colors: true }));
    process.exit(1);
  }

  const files = ["manifest.json", "versions.json", ".hotreload"];
  await Promise.all(files.map((file) => copyFile(resolve("assets", file), resolve("dist", file))));
  console.info("Build completed successfully!");
  console.info(stats?.toString({ colors: true }));
});

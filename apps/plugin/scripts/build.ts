import { rspack } from "@rspack/core";
import { load } from "@std/dotenv";
import { resolve } from "@std/path";

await load({ envPath: resolve(".env"), export: true });
await load({ envPath: resolve(".env.local"), export: true });

rspack({
  entry: "./src/mod.ts",
  output: {
    path: resolve("dist"),
    clean: true,
    filename: "main.js",
    cssFilename: "styles.css",
    library: { type: "commonjs-static" },
  },
  resolve: {
    extensions: [".ts", ".tsx"],
    alias: {
      "@plugin": resolve("src"),
      "@env": resolve(".env"),
      "@nimir/shared": resolve("../../libs/shared/src/mod.ts"),
      "@nimir/interaction": resolve("../../libs/interaction/src/mod.ts"),
      "@nimir/framework": resolve("../../libs/framework/src/mod.ts"),
      "@shared": resolve("../../libs/shared/src"),
      "@interaction": resolve("../../libs/interaction/src"),
      "@framework": resolve("../../libs/framework/src"),
    },
  },
  experiments: { css: true },
  externals: ["obsidian"],
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "postcss-loader",
        type: "css",
      },
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        type: "javascript/auto",
        options: {
          jsc: {
            parser: { syntax: "typescript", decorators: true },
            target: "esnext",
          },
        },
      },
      {
        test: /\\.env$/,
        loader: "./scripts/env-loader.ts",
        type: "json",
      },
      {
        test: /\.tsx$/,
        loader: "babel-loader",
        type: "javascript/auto",
        options: { presets: ["@babel/preset-typescript", "solid"] },
      },
    ],
  },
  stats: "normal",
  mode: "development",
}).run(async (error, stats) => {
  if (error) {
    console.error("Build failed:", error);
    Deno.exit(1);
  }

  if (stats?.hasErrors()) {
    console.error("Build completed with errors:", stats.toString({ colors: true }));
    Deno.exit(1);
  }

  const files = ["manifest.json", "versions.json", ".hotreload"];
  console.info("Moving static files...");
  await Promise.all(
    files.map((file) => Deno.copyFile(resolve("assets", file), resolve("dist", file))),
  );
  console.info(files.map((file) => `- asset ${file}`).join("\n"));
  console.info("Static files moved successfully!");

  console.info("Build completed successfully!");
  console.info(stats?.toString({ colors: true }));
});

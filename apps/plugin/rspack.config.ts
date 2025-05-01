import { rspack } from "@rspack/core";
import { resolve } from "@std/path";

console.log(resolve("../../node_modules/obsidian"));

const compiler = rspack({
  entry: "./src/main.ts",
  output: {
    path: resolve("dist"),
    filename: "main.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts"],
  },
  externals: ["obsidian"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        options: { jsc: { parser: { syntax: "typescript" } } },
        type: "javascript/auto",
      },
    ],
  },
  stats: "normal",
  mode: "production",
});

compiler.run(async (error, stats) => {
  if (error) {
    console.error("Build failed:", error);
    Deno.exit(1);
  }

  if (stats?.hasErrors()) {
    console.error("Build completed with errors:", stats.toString({ colors: true }));
    Deno.exit(1);
  }

  await Promise.all([
    Deno.copyFile("manifest.json", "dist/manifest.json"),
    Deno.copyFile("versions.json", "dist/versions.json"),
  ]);

  console.info("Build completed successfully!");
  console.info(stats?.toString({ colors: true }));
});

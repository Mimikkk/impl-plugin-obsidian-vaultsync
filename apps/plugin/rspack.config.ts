import { rspack } from "@rspack/core";
import { resolve } from "@std/path";

rspack({
  entry: "./src/main.ts",
  output: {
    path: resolve("dist"),
    filename: "main.js",
    clean: true,
    library: { type: "commonjs-static" },
  },
  experiments: { outputModule: true },
  resolve: { extensions: [".ts"] },
  externals: ["obsidian"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "builtin:swc-loader",
        options: { jsc: { parser: { syntax: "typescript" }, target: "esnext" } },
        type: "javascript/auto",
      },
    ],
  },
  stats: "normal",
  mode: "production",
}).run(async (error, stats) => {
  if (error) {
    console.error("Build failed:", error);
    Deno.exit(1);
  }

  if (stats?.hasErrors()) {
    console.error("Build completed with errors:", stats.toString({ colors: true }));
    Deno.exit(1);
  }

  const files = ["manifest.json", "versions.json"];
  console.info("Moving static files...");
  await Promise.all(
    files.map((file) => Deno.copyFile(file, resolve("dist", file))),
  );
  console.info(files.map((file) => `- asset ${file}`).join("\n"));
  console.info("Static files moved successfully!");

  console.info("Build completed successfully!");
  console.info(stats?.toString({ colors: true }));
});

import { rspack } from "@rspack/core";

const compiler = rspack({
  entry: "./src/main.ts",
  output: {
    path: "./dist",
    filename: "main.js",
    clean: true,
  },
});

compiler.run((err, stats) => {
  console.log("Build", err, stats);
});

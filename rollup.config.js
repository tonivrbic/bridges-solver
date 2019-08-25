import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "lib/index.cjs.js",
      format: "cjs"
    },
    {
      file: "lib/index.js",
      format: "esm"
    }
  ],
  plugins: [
    del({ targets: "lib/*" }),
    typescript({
      tsconfigOverride: {
        compilerOptions: { module: "es2015" }
      }
    })
  ]
};

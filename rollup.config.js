import typescript from "rollup-plugin-typescript2";
import del from "rollup-plugin-delete";

export default {
  input: "./src/main.ts",
  output: [
    {
      file: "lib/solver.common.js",
      format: "cjs"
    },
    {
      file: "lib/solver.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    del({ targets: "lib/*" }),
    typescript({ tsconfigOverride: { compilerOptions: { module: "es2015" } } })
  ]
};

import commonjs from "@rollup/plugin-commonjs";

import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import { terser } from "rollup-plugin-terser";

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    name: "main",
    format: "iife",
    plugins: [terser()],
  },
  plugins: [commonjs(), resolve, babel({ babelHelpers: "bundled" })],
};

import * as execa from "execa";
import tempfile = require("tempfile");
import * as fs from "fs";
import * as extend from "xtend";

interface Result {
  output: string;
  error: string;
  message?: string;
}

export const ENGINE_ALIASES = {
  js: "javascript",
  ts: "typescript",
  rs: "rust",
  py: "python",
  "c++": "cpp",
  "*": "generic",
};

enum EngineType {
  EVAL,
  COMPILE,
  REPL,
  OTHER,
}

interface Engine {
  (code: string): Promise<Result>;
  $type?: EngineType;
}

function EvalFromStringEngine(command: string, args: string[] | string, message?: string): Engine {
  let engine: Engine = async (code) => {
    args = Array.isArray(args) ? args : [args];
    let res = {} as Result;
    res.message = message || `running: ${command} ${args.join(" ")}`;
    args.push(code);
    try {
      const r = await execa(command, args);
      res.output = r.stdout;
    } catch (e) {
      res.error = e.stderr ? e.stderr : e.shortMessage;
    }
    return res;
  };
  engine.$type = EngineType.EVAL;
  return engine;
}

// JS
const eng_javascript = EvalFromStringEngine("node", "-e");
const eng_typescript = EvalFromStringEngine("ts-node", "-e");
const eng_coffeescript = EvalFromStringEngine("coffee", "-e");
// Other programming languages
const eng_clojure_lein = EvalFromStringEngine("lein", ["exec", "-ep"]); // The Leiningen engine requires lein-exec plugin.
const eng_groovy = EvalFromStringEngine("groovy", "-e");
const eng_octave = EvalFromStringEngine("octave", "--eval");
const eng_perl = EvalFromStringEngine("perl", "-E");
const eng_python = EvalFromStringEngine("python", "-c");
const eng_ruby = EvalFromStringEngine("ruby", "-e");
const eng_scala = EvalFromStringEngine("scala", "-e");
// Shell
const eng_sh = EvalFromStringEngine("sh", "-c");
const eng_bash = EvalFromStringEngine("bash", "-c");
const eng_csh = EvalFromStringEngine("csh", "-c");
const eng_dash = EvalFromStringEngine("dash", "-c");
const eng_ksh = EvalFromStringEngine("ksh", "-c");
const eng_tcsh = EvalFromStringEngine("tcsh", "-c");
const eng_zsh = EvalFromStringEngine("zsh", "-c");
// SQL
const eng_mysql = EvalFromStringEngine("mysql", "-e");
const eng_psql = EvalFromStringEngine("psql", "-c");

function CompileAndEvalEngine(command: string, ext: string, buildOpt?: string, outOpt: string | null = "-o"): Engine {
  return async (code) => {
    const src = tempfile(ext);
    const bin = src.split(".")[0];
    fs.writeFileSync(src, code, "utf8");

    let args = [];
    buildOpt && args.push(buildOpt);
    outOpt && args.push(outOpt) && args.push(bin);
    args.push(src);

    let res = {} as Result;
    try {
      res.message = (await execa(command, args)).stdout; // compiler messagge
      try {
        res.output = (await execa(bin)).stdout; // binary output
      } catch (e) {
        res.error = e.stderr || e.shortMessage;
      }
    } catch (e) {
      res.error = e.stderr || e.shortMessage;
    } finally {
      try {
        fs.unlinkSync(src);
        fs.unlinkSync(bin);
      } catch (e) {}
    }
    return res;
  };
}

// C-like
const eng_c_clang = CompileAndEvalEngine("clang", ".c");
const eng_c_gcc = CompileAndEvalEngine("gcc", ".c");
const eng_cpp_clang = CompileAndEvalEngine("clang", ".cpp");
const eng_cpp_gpp = CompileAndEvalEngine("g++", ".cpp");
// others
const eng_go = CompileAndEvalEngine("go", ".go", "build");
const eng_rust_rustc = CompileAndEvalEngine("rustc", ".rs");

function ReplEngine() {}

const eng_scala_repl = ReplEngine();

export function defaultEngine(language) {
  const defaultEngines = { bash: "bash", javascript: "node", rust: "rustc", r: "Rscript", python: "python" };
  //let options = getOptions();
  //return (options.defaultEngines && options.defaultEngines[language]) || defaultEngines[language];
  return defaultEngines;
}

const engine2language = {
  node: "javascript",
  cargo: "rust",
};

// Automatically generated by macros/gen_engines.py
export let ENGINES: { [lang: string]: { [engine: string]: Engine } } = {
  bash: { bash: eng_bash },
  c: { clang: eng_c_clang, gcc: eng_c_gcc },
  clojure: { lein: eng_clojure_lein },
  coffeescript: { coffee: eng_coffeescript },
  cpp: { clang: eng_cpp_clang, g: eng_cpp_gpp },
  csh: { csh: eng_csh },
  dash: { dash: eng_dash },
  go: { go: eng_go },
  groovy: { groovy: eng_groovy },
  javascript: { node: eng_javascript },
  ksh: { ksh: eng_ksh },
  mysql: { mysql: eng_mysql },
  octave: { octave: eng_octave },
  perl: { perl: eng_perl },
  psql: { psql: eng_psql },
  python: { python: eng_python },
  ruby: { ruby: eng_ruby },
  rust: { rustc: eng_rust_rustc },
  scala: { scala: eng_scala },
  sh: { sh: eng_sh },
  tcsh: { tcsh: eng_tcsh },
  typescript: { ts: eng_typescript },
  zsh: { zsh: eng_zsh },
};

ENGINES.shell = extend(ENGINES.sh, ENGINES.bash, ENGINES.csh, ENGINES.dash, ENGINES.ksh, ENGINES.tcsh, ENGINES.zsh);

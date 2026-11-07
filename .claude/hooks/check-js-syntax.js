// PostToolUse hook: after Claude edits a .js file, run `node --check` on it so a
// syntax error is caught immediately instead of at "Load unpacked" time.
// Also flags manifest.json if it stops being valid JSON.
// Exit code 2 feeds stderr back to Claude; 0 is silent.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let file;
  try {
    file = JSON.parse(raw).tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (!file || !fs.existsSync(file)) process.exit(0);

  if (file.endsWith(".js")) {
    const r = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (r.status !== 0) {
      console.error(`Syntax error in ${file}:\n${r.stderr}`);
      process.exit(2);
    }
  } else if (file.endsWith("manifest.json")) {
    try {
      JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.error(`manifest.json is not valid JSON: ${e.message}`);
      process.exit(2);
    }
  }
  process.exit(0);
});

const { spawn } = require("child_process");

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? (process.env.ComSpec || "cmd.exe") : "npm";
const processes = [
  { name: "SERVER", args: ["run", "server"], cwd: process.cwd() },
  { name: "CLIENT", args: ["run", "client"], cwd: process.cwd() }
];

const children = processes.map(processInfo => {
  const args = isWindows ? ["/d", "/s", "/c", `npm ${processInfo.args.join(" ")}`] : processInfo.args;
  const child = spawn(npmCommand, args, {
    cwd: processInfo.cwd,
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: ["inherit", "pipe", "pipe"],
    shell: false
  });
  child.stdout.on("data", data => process.stdout.write(`[${processInfo.name}] ${data}`));
  child.stderr.on("data", data => process.stderr.write(`[${processInfo.name}] ${data}`));
  child.on("exit", (code, signal) => {
    if (!isShuttingDown && code !== 0) {
      console.error(`[${processInfo.name}] stopped with code ${code || signal}`);
      shutdown(code || 1);
    }
  });
  return child;
});

let isShuttingDown = false;
function shutdown(exitCode = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(exitCode), 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

import os from "os";
import path from "path";
import fs from "fs";

export function dCommand_1(currentDirectory, scriptPath) {
  const command = [
    "docker run",
    "--rm",
    "--cpus=0.5",
    "--memory=256m",
    "--pids-limit=50",
    "--network=none",
    "--read-only",
    "--cap-drop=ALL", // Remove all Linux capabilities
    "--security-opt=no-new-privileges", // Prevent privilege escalation
    "-u",
    "1000:1000", // Run as non-root user
    `-v ${currentDirectory}:/app:ro`, // Read-only mount
    "python:latest",
    "python",
    `/app/${scriptPath}`,
  ].join(" ");

  return command;
}

export function dCommand(code) {
  const tempDir = folderCreation(code);

  const command = [
    "docker run",
    "--rm",
    "--cpus=0.5",
    "--memory=256m",
    "--pids-limit=50",
    "--network=none",
    "--read-only",
    "--cap-drop=ALL",
    "--security-opt=no-new-privileges",
    "-u",
    "1000:1000",
    `-v ${tempDir}:/app:ro`,
    "python:latest",
    "python",
    "/app/script.py",
  ].join(" ");

  return { command, tempDir };
}

export function folderCreation(code) {
  // safe
  // const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-run-"));

  // not that safe
  // this tempDir is in our current directory
  const tempBase = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase);
  const tempDir = fs.mkdtempSync(path.join(tempBase, "code-run-"));

  const scriptPath = path.join(tempDir, "script.py");
  fs.writeFileSync(scriptPath, code);
  return tempDir;
}

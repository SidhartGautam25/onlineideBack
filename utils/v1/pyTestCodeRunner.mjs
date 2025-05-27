import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { safeDelete } from "../../fileHandling/filecleaning.mjs";

export function pyTestCodeRunner(code, inputs, outputs) {
  // const tempDir = folderCreation2(code);
  // console.log("tempDior looks like this ", tempDir);
  // const cmdParts = dCommad2(tempDir);
  let results = [];
  let outputValue = [];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const output = outputs[i];
    console.log("input is ", input);
    console.log("output is ", output);
    // const result = spawnSync(cmdParts[0], cmdParts.slice(1), {
    //   input,
    //   encoding: "utf-8",
    //   timeout: 3000,
    // });
    const result = executePython(code, input);
    console.log("result iis ", result);
    if (result.error) {
      console.log("some error occured while executing in docker", result.error);
      results.push(false);
      continue;
    }
    const out = result.stdout.trim();
    console.log("out is ", out);
    console.log("output.trim is ", output.trim());
    if (out == output.trim()) {
      results.push(true);
      outputValue.push(out);
    } else {
      results.push(false);
      outputValue.push(out);
    }
  }
  // safeDelete(tempDir);
  return { results, outputValue };
}

export function folderCreation(code) {
  // const tempBase = path.join(process.cwd(), "temp");
  // if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase);
  // const tempDir = fs.mkdtempSync(path.join(tempBase, "codeRun"));

  // const scriptPath = path.join(tempDir, "script.py");
  // fs.writeFileSync(scriptPath, code);
  // return tempDir;
  const tempBase = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase);
  const tempDir = fs.mkdtempSync(path.join(tempBase, "code-run-"));

  const scriptPath = path.join(tempDir, "script.py");
  fs.writeFileSync(scriptPath, code);
  return tempDir;
}
export function dCommad(tempDir) {
  const dockerPath = tempDir
    .trim()
    .replace(/\\/g, "/") // Replace backslashes with forward slashes
    .replace(/^([A-Z]):/, (match, drive) => `/${drive.toLowerCase()}`); // Convert C: to /c
  return [
    "docker",
    "run",
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
    `-v ${dockerPath}:/app:ro`,
    "python:latest",
    "python",
    "/app/script.py",
  ];
}

export function folderCreation2(code) {
  const tempDir = fs.mkdtempSync(path.join(process.cwd(), "temp", "code-run-"));
  fs.writeFileSync(path.join(tempDir, "script.py"), code);
  return tempDir;
}

export function dCommad2(tempDir) {
  // For Windows Docker, use the raw Windows path with drive letter
  const volumePath =
    process.platform === "win32"
      ? `${tempDir}:C:\\app:ro` // Windows format with drive letter
      : `${tempDir}:/app:ro`; // Unix format

  return [
    "docker",
    "run",
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
    `-v ${volumePath}`,
    "python:latest",
    "python",
    "/app/script.py",
  ];
}

export function executePython(code, userInput = "") {
  const dockerProcess = spawnSync(
    "docker",
    [
      "run",
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
      "-i", // Keep STDIN open
      "python:latest",
      "python",
      "-c",
      code,
    ],
    {
      input: userInput,
      encoding: "utf-8",
      timeout: 5000,
    }
  );

  return {
    stdout: dockerProcess.stdout,
    stderr: dockerProcess.stderr,
    status: dockerProcess.status,
    error: dockerProcess.error,
  };
}

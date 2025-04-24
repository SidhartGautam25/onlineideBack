export function dCommand(currentDirectory, scriptPath) {
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

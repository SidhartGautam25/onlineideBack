// workers/codeExecutor.js
import { Worker } from "bullmq";
import { dCommand } from "../dCommand/dCommand.mjs";
import { safeDelete } from "../fileHandling/filecleaning.mjs";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const connection = {
  host: "localhost",
  port: 6379,
};

const worker = new Worker(
  "codeQueue",
  async (job) => {
    const { code } = job.data;
    const { command, tempDir } = dCommand(code);

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 3000 });
      return { output: stdout, error: stderr };
    } catch (error) {
      return { output: "", error: error.message };
    } finally {
      safeDelete(tempDir);
    }
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

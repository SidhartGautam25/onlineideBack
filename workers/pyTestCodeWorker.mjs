import { Worker } from "bullmq";
import { dCommand } from "../dCommand/dCommand.mjs";
import { safeDelete } from "../fileHandling/filecleaning.mjs";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { pyTestCodeRunner } from "../utils/v1/pyTestCodeRunner.mjs";
import { getInput, getOutput } from "../utils/v1/getInput.mjs";

const execAsync = promisify(exec);

const connection = {
  host: "localhost",
  port: 6379,
};

const worker = new Worker(
  "PyTestCodeQueue",
  async (job) => {
    console.log("job details are ", job.data);
    const { code, qstnNumber } = job.data;
    // let qstnNumber = 1;
    const inputs = getInput(qstnNumber);
    const outputs = getOutput(qstnNumber);
    console.log("inputs are ", inputs);
    console.log("outputs are ", outputs);
    const res = pyTestCodeRunner(code, inputs, outputs);
    return { result: res };
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

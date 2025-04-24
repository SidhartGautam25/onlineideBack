import { Queue } from "bullmq";
import { createClient } from "redis";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connection = {
  host: "localhost",
  port: 6379,
};

export const codeQueue = new Queue("codeQueue", { connection });

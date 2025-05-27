import express from "express";
import fs from "fs";
import cors from "cors";
import { exec } from "child_process";
import { checkPythonCode } from "./checkCode/python/pyCheck.mjs";
import { dCommand } from "./dCommand/dCommand.mjs";
import { safeDelete } from "./fileHandling/filecleaning.mjs";
import { codeQueue } from "./queues/codeQueue.mjs";
import { v4 as uuidv4 } from "uuid";
import pyThingsRoute from "./routes/v1/python.mjs";
import problemRoutes from "./routes/v1/problems.mjs";
// import { Job } from "bullmq";

//const redis = require('redis');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log("requets is coming to the server");
  next();
});
//const redisClient = redis.createClient();

app.post("/execute_1", (req, res) => {
  console.log("i get the code ");
  console.dir(req.body, { depth: null });
  const pythonCode = req.body.code;
  const checkCodeOutput = checkPythonCode(pythonCode);
  if (checkCodeOutput.error) {
    return res.status(400).json(checkCodeOutput);
  }

  /*

  old code

  const scriptPath = "./script.py";
  fs.writeFileSync(scriptPath, pythonCode);

  const currentDirectory = __dirname;
  console.log(currentDirectory);

  */

  // const command = `docker run --rm  --cpus 0.5 --memory 256M --network none --read-only --pids-limit 50 -v ${currentDirectory}:/app python:latest python /app/${scriptPath}`;
  const obj = dCommand(pythonCode);
  const time = 3000;

  /*

  old code


  const program = exec(command, { timeout: time }, (error, stdout, stderr) => {
    if (error) {
      console.log("error is occured while executing program");
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
    // redisClient.setex(pythonCode, 60 * 5, stdout);
    console.log("we reached here without any errors");
    res.json({ output: stdout, error: stderr });
  });

  */

  // stage three code
  const program = exec(
    obj.command,
    { timeout: time },
    (error, stdout, stderr) => {
      // Clean up temp dir
      // this is syncronous
      // fs.rmSync(obj.tempDir, { recursive: true, force: true });
      safeDelete(obj.tempDir);

      if (error) {
        console.error("Execution error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ output: stdout, error: stderr });
    }
  );

  /*
  old code 

  program.on("timeout", () => {
    console.log("timeout my friend");
    execution.kill(); // Kill the process if it exceeds the timeout
    res.status(500).json({ error: "Time Limit Excedded" });
  });

  */

  program.on("timeout", () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
    program.kill();
    res.status(500).json({ error: "Execution timed out" });
  });

  //}
  //  })
});

app.listen(PORT, () => {
  // console.log(__dirname);
  console.log(`Server is running on port ${PORT}`);
});

app.post("/execute", async (req, res) => {
  console.log("execute controller");
  const code = req.body.code;
  const checkCodeOutput = checkPythonCode(code);
  if (checkCodeOutput.error) {
    return res.status(400).json(checkCodeOutput);
  }

  const jobId = uuidv4();

  try {
    console.log("adding job to codeQueue");
    await codeQueue.add("executePython", { code }, { jobId });
    console.log("job added");
    res.status(202).json({ jobId });
  } catch (err) {
    console.log("error occured in between");
    res.status(500).json({ error: "Failed to enqueue job" });
  }
});

app.get("/status/:id", async (req, res) => {
  const { id } = req.params;
  const job = await codeQueue.getJob(id);

  if (!job) return res.status(404).json({ error: "Job not found" });

  const state = await job.getState();
  const result = job.returnvalue;

  res.json({ state, result });
});

app.use("/v1/py/execute", pyThingsRoute);
app.use("/v1/problems", problemRoutes);

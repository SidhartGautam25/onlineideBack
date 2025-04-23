const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const cors = require("cors");
//const redis = require('redis');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
//const redisClient = redis.createClient();

function isValidPython(code) {
  const pythonCodeRegex = /^[a-zA-Z0-9\s\+\-\*\/%=\(\),;\[\]\{\}_]+$/;

  return pythonCodeRegex.test(code);
}

app.post("/execute", (req, res) => {
  console.log("i get the code ");
  console.dir(req.body, { depth: null });
  const pythonCode = req.body.code;

  //redisClient.get(pythonCode, (err, cachedResult) => {
  // if (err) {
  // console.error('Redis error:', err);
  // }

  // if (cachedResult) {

  //  res.json({ output: cachedResult });
  //   }
  //  else {

  const scriptPath = "./script.py";
  fs.writeFileSync(scriptPath, pythonCode);

  const currentDirectory = __dirname;
  console.log(currentDirectory);

  const command = `docker run --rm  --cpus 0.5 --memory 256M --network none --read-only --pids-limit 50 -v ${currentDirectory}:/app python:latest python /app/${scriptPath}`;
  const time = 3000;

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

  program.on("timeout", () => {
    console.log("timeout my friend");
    execution.kill(); // Kill the process if it exceeds the timeout
    res.status(500).json({ error: "Time Limit Excedded" });
  });

  //}
  //  })
});

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`Server is running on port ${PORT}`);
});

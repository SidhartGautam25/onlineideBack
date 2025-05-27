import { checkPythonCode } from "../../checkCode/python/pyCheck.mjs";
import { PyTestCodeQueue } from "../../queues/testCodeQueue.mjs";
import { getJobId } from "../../utils/v1/getJobId.mjs";

export async function pyExecuteTestV1(req, res) {
  console.log("request is coming to controller");
  const code = req.body.code;
  const qstnNumber = req.body.qstnNumber;
  console.log("qstn number is ", qstnNumber);
  const checkCodeOutput = checkPythonCode(code);
  if (checkCodeOutput.error) {
    console.log("error occured while checking code");
    return res.status(400).json(checkCodeOutput);
  }
  const jobId = getJobId();
  console.log("jobid is ", jobId);
  try {
    console.log("adding job to queue");
    await PyTestCodeQueue.add(
      "executePythonTestCode",
      { code, qstnNumber },
      { jobId }
    );
    console.log("job added to queue and job id is ", jobId);
    res.status(202).json({ jobId });
  } catch (err) {
    console.log("error occured in between");
    res.status(500).json({ error: "Failed to enqueue job" });
  }
}

export async function pyTestResultV1(req, res) {
  const { id } = req.params;
  const job = await PyTestCodeQueue.getJob(id);

  if (!job) return res.status(404).json({ error: "Job not found" });

  const state = await job.getState();
  const result = job.returnvalue;

  res.json({ state, result });
}

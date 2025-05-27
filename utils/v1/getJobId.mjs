import { v4 as uuidv4 } from "uuid";
var id = 1;

export function getJobId() {
  const jobId = uuidv4();
  id++;
  return jobId;
}

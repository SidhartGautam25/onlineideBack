import { problems } from "../../problems/total.mjs";

export function getInput(num) {
  const qstn = problems[num - 1];
  console.log("qstn is ", qstn);
  const input = qstn["ex"];
  return input;
}

export function getOutput(num) {
  const qstn = problems[num - 1];
  const output = qstn["exout"];
  return output;
}

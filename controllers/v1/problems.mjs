import { problems } from "../../problems/total.mjs";
import { addQuestion } from "../../problems/problem_functions.mjs";
export async function addProblem(req, res) {
  const len = problems.length;

  const qstn = req.body.qstn;
  qstn.number = len + 1;
  addQuestion(qstn);

  res.json({ message: "question added successfully" });
}

export async function deleteProblem(req, res) {
  const { num } = req.params;

  res.json({ message: "question deleted succesfully" });
}

export async function getProblems(req, res) {
  res.json({ problems });
}

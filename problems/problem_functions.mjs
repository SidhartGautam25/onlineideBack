import { problems } from "./total.mjs";

export function addQuestion(qstn) {
  if (!qstn || typeof qstn !== "object") {
    console.error("invalid question object");
  }
  let len = problems.length;
  if (qstn.number <= len) {
    console.error("this question number exist");
  }
  problems.push(qstn);
  console.log("qstn added to problems successfully");
}

export function deleteQuestion(number) {
  let len = problems.length;
  if (number < 1 || number > len) {
    console.error("this problem does not exist");
  }
  problems.slice(number - 1, 1);
  console.log("question deleted successfully");
}

export function editQuestion(number, updates) {
  let len = problems.length;
  const question = problems[number - 1];
  if (number < 1 || number > len) {
    console.error("this problem does not exist");
  }
  for (const key in updates) {
    if (question.hasOwnProperty(key)) {
      question[key] = updates[key];
    } else {
      console.warn(`Property '${key}' is not valid and will be ignored.`);
    }
  }

  console.log(`Question #${number} updated successfully.`);
}

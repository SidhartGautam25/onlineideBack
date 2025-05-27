import express from "express";

import { pyExecuteTestV1 } from "../../controllers/v1/pyThings.mjs";
import { pyTestResultV1 } from "../../controllers/v1/pyThings.mjs";
import { getProblems } from "../../controllers/v1/problems.mjs";

const router = express.Router();

// router.post("/add");
// router.delete("/delete/:num");
router.get("/all", getProblems);

export default router;

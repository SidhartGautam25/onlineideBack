import express from "express";

import { pyExecuteTestV1 } from "../../controllers/v1/pyThings.mjs";
import { pyTestResultV1 } from "../../controllers/v1/pyThings.mjs";

const router = express.Router();

router.post("/test", pyExecuteTestV1);
router.get("/result/test/:id", pyTestResultV1);

export default router;

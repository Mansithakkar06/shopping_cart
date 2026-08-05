import express from "express";

import {
    getAllData,
    getSingleData,
    createData,
    updateData,
    deleteData
} from "../controllers/dynamic.controller.js";
import { upload, handleFileUpload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/:modelName", getAllData);
router.get("/:modelName/:id", getSingleData);
router.post("/:modelName", upload.single('image'), handleFileUpload, createData);
router.put("/:modelName/:id", upload.single('image'), handleFileUpload, updateData);
router.delete("/:modelName/:id", deleteData);

export default router;
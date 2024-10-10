import express from "express";
import {
    deleteUser,
    getUser,
    updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id", getUser);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;

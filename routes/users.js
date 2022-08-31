import express from "express";

import userControllers from "../controllers/users.js";
import { verifyToken } from "../validator/jwt.js";

const router = express.Router();

router.get("/books", verifyToken, userControllers.getBooks);

router.post("/register", userControllers.createUser);

router.post("/login", userControllers.logUser);

export default router;

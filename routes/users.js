import express from "express";

import userControllers from "../controllers/users.js";
import { verifyToken } from "../validator/jwt.js";

const router = express.Router({ mergeParams: true });

router.get("/books/:id", verifyToken, userControllers.getBooks);

router.post("/register", userControllers.createUser);

router.post("/login", userControllers.logUser);

export default router;

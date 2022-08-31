import express from "express";

import bookControllers from "../controllers/books.js";

const router = express.Router();

router.get("/user/:id" /*asdas */);

router.post("/add-books/:id", bookControllers.createUser);

router.post("/update-books/:id", bookControllers.logUser);

router.delete("/delete-books/:id" /*sfdsd */);

export default router;

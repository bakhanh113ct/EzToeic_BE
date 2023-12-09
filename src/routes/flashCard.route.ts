import express from "express";
import { verifyAccessToken } from "../utils/jwt.service";
import {
  createVocab,
  createVocabList,
  deleteVocab,
  deleteVocabList,
  getAllFlashcard,
  getOneFlashcard,
  updateVocab,
  updateVocabList,
} from "../controllers/flashcard.controller";

const flashcardRoute = express.Router();

flashcardRoute.get("/", verifyAccessToken, getAllFlashcard);
flashcardRoute.get("/lists/:listId", verifyAccessToken, getOneFlashcard);
flashcardRoute.post("/lists", verifyAccessToken, createVocabList);
flashcardRoute.post("/lists/:listId", verifyAccessToken, updateVocabList);
flashcardRoute.delete("/lists/:listId", verifyAccessToken, deleteVocabList);
flashcardRoute.post("/lists/:listId/vocabs", verifyAccessToken, createVocab);
flashcardRoute.post("/vocabs/:vocabId", verifyAccessToken, updateVocab);
flashcardRoute.delete("/vocabs/:vocabId", verifyAccessToken, deleteVocab);

export default flashcardRoute;

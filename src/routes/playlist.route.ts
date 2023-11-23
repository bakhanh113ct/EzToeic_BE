import { Router } from "express";
import { verifyAccessToken } from "../utils/jwt.service";
import {
  addLesson,
  addPlaylist,
  getAllPlaylist,
  getLessonsInPlaylist,
  getOneLesson,
} from "../controllers/playlist.controller";

const playlistRoute: Router = Router();

playlistRoute.get("/", verifyAccessToken, getAllPlaylist);
playlistRoute.post("/", verifyAccessToken, addPlaylist);
playlistRoute.get("/:playlistId", verifyAccessToken, getLessonsInPlaylist);
playlistRoute.get("/lessons/:lessonId", verifyAccessToken, getOneLesson);
playlistRoute.put("/:playlistId", verifyAccessToken, addLesson);

export default playlistRoute;

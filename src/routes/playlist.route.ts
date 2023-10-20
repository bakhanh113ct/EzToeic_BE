import { Router } from "express";
import { verifyAccessToken } from "../utils/jwt.service";
import { getAllPlaylist } from "../controllers/playlist.controller";

const playlistRoute: Router = Router();

playlistRoute.get("/", verifyAccessToken, getAllPlaylist);

export default playlistRoute;

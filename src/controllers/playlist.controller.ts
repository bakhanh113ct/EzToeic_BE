import { NextFunction, Request, Response } from "express";
import { VocabList } from "../models/vocabList.model";
import { Vocab } from "../models/vocab.model";
import { Errors } from "../helpers/error";
import { Playlist } from "../models/playlist.model";
import { ILike } from "typeorm";

const getAllPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page: number = Number(req.query.page) || 1;
  const perPage = 6;
  const search = req.query.search || "";

  const playlists = await Playlist.find({
    relations: {
      lessons: true,
    },
    take: perPage,
    skip: (page - 1) * perPage,
    where: { title: ILike(`%${search}%`) },
    order: { id: "ASC", lessons: { id: "ASC" } },
  });

  return res.json(playlists);
};

export { getAllPlaylist };

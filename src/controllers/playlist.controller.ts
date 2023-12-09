import { NextFunction, Request, Response } from "express";
import { VocabList } from "../models/vocabList.model";
import { Vocab } from "../models/vocab.model";
import { ErrorResp, Errors } from "../helpers/error";
import { Playlist } from "../models/playlist.model";
import { ILike } from "typeorm";
import { Lesson } from "../models/lesson.model";

const getAllPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page: number = Number(req.query.page) || 1;
  const perPage = 6;
  const search = req.query.search || "";

  const itemCount = await Playlist.count({
    where: { title: ILike(`%${search}%`) },
    order: { id: "ASC", lessons: { id: "ASC" } },
  });

  const playlists = await Playlist.find({
    relations: {
      lessons: true,
    },
    take: perPage,
    skip: (page - 1) * perPage,
    where: { title: ILike(`%${search}%`) },
    order: { id: "ASC", lessons: { id: "ASC" } },
  });

  return res.json({
    pageCount: Math.ceil(itemCount / perPage),
    playlists: playlists,
  });
};

const getLessonsInPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page: number = Number(req.query.page) || 1;
  const perPage = 6;
  const search = req.query.search || "";

  const itemCount = await Lesson.count({
    where: { playlist: { id: Number(req.params.playlistId) } },
    order: { id: "ASC" },
  });

  const lessons = await Lesson.find({
    where: {
      playlist: { id: Number(req.params.playlistId) },
    },
    take: perPage,
    skip: (page - 1) * perPage,
    order: { id: "ASC" },
  });

  return res.json({
    pageCount: Math.ceil(itemCount / perPage),
    lessons: lessons,
  });
};

const getOneLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await Lesson.findOne({
      where: {
        id: Number(req.params.lessonId),
      },
    });
    if (lesson == null) {
      const error = new ErrorResp("error.badRequest", "Response is null", 400);
      next(error);
    }
    return res.json(lesson);
  } catch (err) {
    next(err);
  }
};

const addLesson = async (req: Request, res: Response, next: NextFunction) => {
  const { playlistId } = req.params;
  const body = req.body;

  try {
    const lesson = Lesson.create({
      title: body.title,
      videoUrl: body.videoUrl,
      playlist: { id: Number(playlistId) },
    });

    await lesson.save();

    return res.json(lesson);
  } catch (err) {
    return res.json(err);
  }
};

const addPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  const { title, thumbnailUrl } = req.body;

  console.log(title);

  const playlist = Playlist.create({
    title: title,
    thumbnailUrl: thumbnailUrl,
  });

  try {
    await playlist.save();
    return res.json({
      message: "success",
      data: playlist,
    });
  } catch (err) {
    return res.json(Errors.BadRequest);
  }
};

const deletePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const deleteVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export {
  getAllPlaylist,
  getLessonsInPlaylist,
  getOneLesson,
  addLesson,
  addPlaylist,
};

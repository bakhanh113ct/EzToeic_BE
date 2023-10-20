import { NextFunction, Request, Response } from "express";
import { VocabList } from "../models/vocabList.model";
import { Vocab } from "../models/vocab.model";
import { Errors } from "../helpers/error";

const getAllFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const flashcards = await VocabList.find({
    relations: {
      vocabs: true,
    },
    order: {
      id: "ASC"
    }
  });
  return res.json(flashcards);
};

const createVocabList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  console.log(body);

  const vocabList = VocabList.create({
    title: body.title,
    description: body.description,
    user: { id: req.auth.userId },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await vocabList.save();

  res.json(vocabList);
};

const updateVocabList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("object");
  const body = req.body;
  const listId = req.params.listId || 0;
  const vocabList = await VocabList.findOne({
    where: {
      id: Number(listId),
    },
  });

  vocabList.title = body.title;
  vocabList.description = body.description || vocabList.description;

  await vocabList.save();

  return res.json(vocabList);
};

const deleteVocabList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId } = req.params;

  if (Number(listId) < 1) {
    return next(Errors.BadRequest);
  }

  try {

    const vocabList = await VocabList.findOneBy({id: Number(listId)})
    const rs = await VocabList.remove(vocabList);

    // await rs.save()

    // console.log(object);

    // if (rs. != 0) {
      return res.json({ msg: "Delete successful" });
    // }
    // return res.json({ msg: `Can't find list with id = ${listId}` });
  } catch (err) {
    return res.json(err);
  }
};

const createVocab = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const { listId } = req.params;

  if (Number(listId) < 1) {
    return next(Errors.BadRequest);
  }

  console.log(listId);

  const vocab = Vocab.create({
    vocab: body.vocab,
    definition: body.definition,
    createdAt: new Date(),
    updatedAt: new Date(),
    vocabList: { id: Number(listId) },
  });

  await vocab.save();

  res.json(vocab || {});
};

const updateVocab = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const { vocabId } = req.params;

  if (Number(vocabId) < 1) {
    return next(Errors.BadRequest);
  }

  const vocab = await Vocab.findOneBy({ id: Number(vocabId) });

  vocab.vocab = body.vocab;
  vocab.definition = body.definition;
  vocab.updatedAt = new Date();

  await vocab.save();

  return res.json(vocab);
};

const deleteVocab = async (req: Request, res: Response, next: NextFunction) => {
  const { vocabId } = req.params;

  if (Number(vocabId) < 1) {
    return next(Errors.BadRequest);
  }

  // const vocab = await Vocab.findOneBy({ id: Number(vocabId) });

  try {
    const rs = await Vocab.delete(Number(vocabId));
    if (rs.affected != 0) {
      return res.json({ msg: "Delete successful" });
    }
    return res.json({ msg: `Can't find vocab with id = ${vocabId}` });
  } catch (err) {
    return next(Errors.BadRequest);
  }
};

export {
  getAllFlashcard,
  createVocabList,
  updateVocabList,
  deleteVocabList,
  createVocab,
  updateVocab,
  deleteVocab,
};

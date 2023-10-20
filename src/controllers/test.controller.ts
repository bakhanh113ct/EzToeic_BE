import { NextFunction, Request, Response } from "express";
import { Test } from "../models/test.model";
import { PartDetail } from "../models/partDetail.model";
import { Question } from "../models/question.model";
import { ResultDetail } from "../models/resultDetail.model";
import { Result } from "../models/result.model";
import { User } from "../models/auth.model";
import { ResultPart } from "../models/resultPart.model";
import { Part } from "../models/part.model";
import { DataSource, ILike } from "typeorm";
import { AppDataSource } from "../databases/database";
import { TestSet } from "../models/testSet.model";

const getAllTest = async (req: Request, res: Response, next: NextFunction) => {
  // const tests = await TestSet.createQueryBuilder("testSet")
  //   .innerJoinAndSelect("testSet.tests", "test")
  //   .orderBy("test.title")
  //   .addOrderBy("testSet.title", "DESC")
  //   .getMany();

  const search = req.query.search || "";
  const currentPage: number = Number(req.query.page) || 1;
  const perPage: number = 20;

  const tests = await Test.createQueryBuilder("test")
    .innerJoinAndSelect("test.testSet", "testSet")
    .orderBy("test.title")
    .addOrderBy("testSet.title", "DESC")
    .offset((currentPage - 1) * perPage)
    .limit(perPage)
    .where({ title: ILike(`%${search}%`) })
    .select([
      "test.id as id",
      "test.title as title",
      'test."sectionCount" as "sectionCount"',
      'test."questionCount" as "questionCount"',
      "test.time as time",
      'testSet.title as "setTitle"',
    ])
    .getRawMany();

  return res.json(tests);
};

const getTestById = async (req: Request, res: Response, next: NextFunction) => {
  const parts = req.query.part || [1, 2, 3, 4, 5, 6, 7];
  const test = await Test.findOneBy({ id: Number(req.params.testId) });

  console.log(parts);

  const testPart = await Question.createQueryBuilder("question")
    .innerJoinAndSelect("question.partDetail", "partDetail")
    .innerJoinAndSelect("partDetail.part", "part")
    .orderBy("question.index")
    .where("part.number in(:...numbers)", { numbers: parts })
    .select(["question", "part", "partDetail"])
    // .addSelect()
    .getMany();

  const tests = await PartDetail.createQueryBuilder("partDetail")
    .innerJoinAndSelect("partDetail.questions", "question")
    .innerJoinAndSelect("partDetail.part", "part")
    .orderBy("question.index")
    .where("part.number in(:...numbers)", { numbers: parts })
    .getMany();

  var gr = function (xs: Question[], key) {
    return xs.reduce(function (rv, x) {
      (rv["p" + x[key]] = rv["p" + x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const hi = tests.map((value, index) => {
    // console.log(value.part);
    const { part: _, ...vl } = value;
    return {
      partNumber: value.part.number,
      ...vl,
    };
  });

  const rs = gr(testPart, "part_number");

  return res.json({
    test: test,
    testParts: hi,
  });
};

const getSolutionsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const test = await Question.createQueryBuilder("question")
    .innerJoinAndSelect(
      "question.partDetail",
      "partDetail",
      "question.partDetailId = partDetail.id"
    )
    .orderBy("question.index")
    .where("partDetail.testId = :testId", { testId: req.params.testId })
    .select("question.answer")
    .addSelect("question.index")
    .getMany();

  console.log(test);

  return res.json(test);
};

const getPartSolutionsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.params.partNumber);
  const test = await Question.createQueryBuilder("question")
    .innerJoinAndSelect(
      "question.partDetail",
      "partDetail",
      "question.partDetailId = partDetail.id"
    )
    .innerJoinAndSelect(
      "partDetail.part",
      "part",
      "part.id = partDetail.partId"
    )
    .orderBy("question.index")
    .where("partDetail.testId = :testId", { testId: req.params.testId })
    .andWhere("part.id = :partNumber", {
      partNumber: req.params.partNumber,
    })
    .select("question.answer")
    .addSelect("question.index")
    .getMany();

  return res.json(test);
};

const submitTest = async (req: Request, res: Response, next: NextFunction) => {
  const params = req.body;
  var readingCorrectCount = 0;
  var listeningCorrectCount = 0;

  const questions = await Question.createQueryBuilder("question")
    .innerJoinAndSelect(
      "question.partDetail",
      "partDetail",
      "question.partDetailId = partDetail.id"
    )
    .innerJoinAndSelect(
      "partDetail.part",
      "part",
      "part.id = partDetail.partId"
    )
    .groupBy("question.id")
    .addGroupBy("partDetail.id")
    .addGroupBy("part.id")
    .orderBy("question.index", "ASC")
    .where("partDetail.testId = :testId", { testId: req.params.testId })
    .andWhere("part.number IN(:...numbers)", { numbers: params["parts"] })
    .getMany();

  // console.log(questions);

  const result = await Result.create({
    state: "done",
    score: "0",
    time: params["time"],
    user: { id: req.auth.userId },
    test: { id: Number(req.params.testId) },
    dateComplete: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }).save();

  //Thêm result part
  params["parts"].map(async (value, index) => {
    const part = await Part.findOne({
      where: {
        number: value,
      },
    });

    await ResultPart.create({
      partNumber: value,
      part: part,
      result: result,
    }).save();
  });

  questions.map(async (question, index) => {
    // console.log(params["answers"][value.index.toString()]);
    const resultDetail = ResultDetail.create({
      answerByUser: params["answers"][question.index] ?? null,
      isCorrect:
        params["answers"][question.index] == question.answer ? true : false,
      createdAt: new Date(),
      updatedAt: new Date(),
      question: question,
      result: result,
    });

    console.log(resultDetail.isCorrect);

    //thêm câu đúng
    if (resultDetail.isCorrect && Number(question.index) <= 100) {
      readingCorrectCount += 1;
    } else if (resultDetail.isCorrect) {
      listeningCorrectCount += 1;
    }

    await ResultDetail.insert(resultDetail);
  });

  console.log(readingCorrectCount);
  //tính score
  result.score = (
    (readingCorrectCount * 5 > 495 ? 495 : readingCorrectCount * 5) +
    (listeningCorrectCount * 5 > 495 ? 495 : listeningCorrectCount * 5)
  ).toString();

  result.correctCount = readingCorrectCount + listeningCorrectCount;
  result.readingCorrectCount = readingCorrectCount;
  result.listeningCorrectCount = listeningCorrectCount;
  await result.save();

  const resultDetails = await ResultDetail.createQueryBuilder("resultDetail")
    .innerJoinAndSelect("resultDetail.result", "result")
    .innerJoinAndSelect("resultDetail.question", "question")
    .innerJoinAndSelect("question.partDetail", "partDetail")
    .innerJoinAndSelect("partDetail.part", "part")
    .where("result.id = :id", { id: result.id })
    .orderBy("question.index")
    .select([
      'question.id as "questionId"',
      'resultDetail.id as "resultDetailId"',
      'resultDetail.answerByUser as "answerByUser"',
      'resultDetail.isCorrect as "isCorrect"',
      'question.question as "question"',
      'question.answer as "answer"',
      'question.imageUrl as "imageUrl"',
      'question.audioUrl as "audioUrl"',
      'question.A as "A"',
      'question.B as "B"',
      'question.C as "C"',
      'question.D as "D"',
      'part.number as "partNumber"',
    ])
    .getRawMany();

  var gr = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, []);
  };

  let kq = gr(resultDetails, "partNumber");

  const values = Object.values(kq);
  const keys = Object.keys(kq);

  let questionAnswers = [];

  keys.map((value, index) => {
    const hi = {
      partNumber: value,
      questions: values[index],
    };
    questionAnswers.push(hi);
  });

  return res.json({
    ...result,
    resultDetails: questionAnswers,
  });
};

const getTestResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.params;

  // const test = await Test.findOne({
  //   where: {
  //     id: params.testId,
  //   },
  // });
  const results = await Result.find({
    where: {
      test: { id: Number(params.testId) || -1 },
    },
    order: {
      id: "ASC",
    },
    relations: {
      resultParts: true,
    },
  });

  console.log(results);

  res.json(results);
};

const getDetailResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.params;

  const result = await Result.createQueryBuilder("result")
    .where("result.id = :id", { id: params.resultId })
    .getOne();

  const questions = await ResultDetail.createQueryBuilder("resultDetail")
    .innerJoinAndSelect("resultDetail.result", "result")
    .innerJoinAndSelect("resultDetail.question", "question")
    .innerJoinAndSelect("question.partDetail", "partDetail")
    .innerJoinAndSelect("partDetail.part", "part")
    .where("result.id = :id", { id: params.resultId })
    .orderBy("question.index")
    .select([
      'question.id as "questionId"',
      "resultDetail.id as resultDetailId",
      'resultDetail.answerByUser as "answerByUser"',
      'resultDetail.isCorrect as "isCorrect"',
      'question.question as "question"',
      'question.answer as "answer"',
      'question.imageUrl as "imageUrl"',
      'question.audioUrl as "audioUrl"',
      'question.A as "A"',
      'question.B as "B"',
      'question.C as "C"',
      'question.D as "D"',
      'part.number as "partNumber"',
    ])
    .getRawMany();

  var gr = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, []);
  };

  let kq = gr(questions, "partNumber");

  const values = Object.values(kq);
  const keys = Object.keys(kq);

  let questionAnswers = [];

  keys.map((value, index) => {
    const hi = {
      partNumber: value,
      questions: values[index],
    };
    questionAnswers.push(hi);
  });

  return res.json({
    ...result,
    // readingScore: result.readingCorrectCount * 5,
    // listeningScore: result.listeningCorrectCount * 5,
    resultDetails: questionAnswers,
  });
};

export {
  getTestById,
  getSolutionsById,
  getPartSolutionsById,
  submitTest,
  getAllTest,
  getTestResults,
  getDetailResult,
};

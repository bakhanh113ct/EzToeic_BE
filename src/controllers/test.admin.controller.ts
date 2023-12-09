import { verifyAccessToken } from "../utils/jwt.service";
import multer from "multer";
import { TestSet } from "../models/testSet.model";
import { Test } from "../models/test.model";
import { PartDetail } from "../models/partDetail.model";
import { Question } from "../models/question.model";
// Requiring the module
const reader = require("xlsx");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
// const path = require('path');
// let configFilename = path.join(__dirname, "../../");

// console.log(configFilename)

const uploadTest = async (req, res, next) => {
  //   console.log(req.body['name']);
  //   console.log(req.file);
  const testSetReq = JSON.parse(req.body.testSet);
  const testReq = JSON.parse(req.body.test);
  // console.log(testSetReq);
  // console.log(testReq);

  const testSetExist = await TestSet.findOneBy({
    title: testSetReq.title,
  });

  var testSet = TestSet.create({
    title: testSetReq.title,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  if (testSetExist == null) {
    testSet = await testSet.save();
  } else {
    testSet = testSetExist;
  }

  const testExist = await Test.findOneBy({
    title: testReq.title,
    testSet: { id: testSet.id },
  });

  var test = Test.create({
    title: testReq.title,
    sectionCount: testReq.sectionCount,
    questionCount: testReq.questionCount,
    time: testReq.time,
    createdAt: new Date(),
    updatedAt: new Date(),
    testSet: { id: testSet.id },
  });

  // console.log(test);
  if (testExist == null) {
    test = await test.save();
  } else {
    test = testExist;
    console.log("test existed");
    return res.json("test existed");
  }

  // await Promise.all([testSet.save(), test.save()]);

  var workbook = reader.readFile(`${appDir}/uploads/${req.file.filename}`);
  let partDetails = [];
  let questions = [];

  for (let i = 0; i < workbook.SheetNames.length; i++) {
    const temp = reader.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[i]]
    );
    if (workbook.SheetNames[i] == "PartDetails") {
      temp.forEach((res) => {
        partDetails.push(res);
      });
    } else {
      temp.forEach((res) => {
        questions.push(res);
      });
    }
  }

  //   for(var i = 0; i < partDetails.length; i++) {
  //     console.log(partDetails[i].partDetailId = i);
  //   }

  for (var i = 0; i < partDetails.length; i++) {
    var partDetail = PartDetail.create({
      ...partDetails[i],
      createdAt: new Date(),
      updatedAt: new Date(),
      test: { id: test.id },
      part: { id: partDetails[i].partId },
    });
    //   console.log(partDetail.part);

    partDetail = await partDetail.save();
    const questionInPart = questions.filter(
      (value) => value.Part == partDetails[i].partId
    );

    console.log(questionInPart);

    for (var j = 0; j < questionInPart.length; j++) {
      const question = Question.create({
        ...questionInPart[j],
        partDetail: { id: partDetail.id },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await question.save();
    }
  }

  console.log('end')

  // console.log(partDetails);
  // console.log("--------------------------");
  // console.log(questions);
};

export {
  uploadTest,
};

import { Router } from "express";
import { verifyAdminAccessToken } from "../utils/jwt.service";
import multer from "multer";
import { TestSet } from "../models/testSet.model";
import { Test } from "../models/test.model";
import { PartDetail } from "../models/partDetail.model";
import { Question } from "../models/question.model";
import { uploadTest } from "../controllers/test.admin.controller";
// Requiring the module
const reader = require("xlsx");
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const adminTestRoute: Router = Router();

var uploads = multer({ dest: appDir + "/uploads" });

adminTestRoute.post(
  "/",
  uploads.single("myFile"),
  uploadTest
);

export default adminTestRoute;

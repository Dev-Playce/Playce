import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { log } from "../utils/logUtils";

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('❌ 유효성 검사 실패 : ');
    console.error('- 요청 본문 : ', req.body);
    console.error('- 에러 내용 : ', errors.array());

    res.status(400).json({
      message: "유효성 검사 실패",
      errors: errors.array(),
    });
    return; 
  }
  log("✅ [validate] 유효성 검사 통과");
  next();
};

export default validate;
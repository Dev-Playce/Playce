import { query } from "express-validator";
import validate from "./validate";

export const NearbySearchValidator = [
  query("lat")
    .notEmpty().withMessage("위도(lat)를 입력해주세요.").bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage("위도는 -90 ~ 90 사이여야 합니다."),
  
  query("lng")
    .notEmpty().withMessage("경도(lng)를 입력해주세요.").bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage("경도는 -180 ~ 180 사이여야 합니다."),

  query("radius")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("반경(radius)은 0 이상의 숫자여야 합니다."),

  validate,
];

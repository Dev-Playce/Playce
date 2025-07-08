import { body } from "express-validator";
import validate from "./validate";

export const createBroadcastValidator = [
  body("store_id")
    .notEmpty().withMessage("식당을 입력해주세요.").bail()
    .isInt({ min: 1 }).withMessage("식당은 1 이상의 정수여야 합니다."),
  body("sport_id")
    .notEmpty().withMessage("스포츠를 입력해주세요.").bail()
    .isInt({ min: 1 }).withMessage("스포츠는 1 이상의 정수여야 합니다."),
  body("league_id")
    .notEmpty().withMessage("리그를 입력해주세요.").bail()
    .isInt({ min: 1 }).withMessage("리그는 1 이상의 정수여야 합니다."),
  body("match_date")
    .notEmpty().withMessage("경기 날짜를 입력해주세요.").bail()
    .isISO8601().withMessage("경기 날짜를 형식에 맞게 입력해주세요. (예: 2025-07-01)"),
  body("match_time")
    .notEmpty().withMessage("경기 시간을 입력해주세요.").bail()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("경기 시간을 형식에 맞게 입력해주세요. (예: 18:30)"),
  body("team_one").optional({ checkFalsy: true }).isString().withMessage("팀1은 문자열이어야 합니다."),
  body("team_two").optional({ checkFalsy: true }).isString().withMessage("팀2는 문자열이어야 합니다."),
  body("etc").optional({ checkFalsy: true }).isString().withMessage("기타는 문자열이어야 합니다."),
  validate,
];

export const updateBroadcastValidator = [
  // body("store_id").optional()
  //   .isInt({ min: 1 }).withMessage("식당은 1 이상의 정수여야 합니다."),
  body("sport_id").optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage("스포츠는 1 이상의 정수여야 합니다."),
  body("league_id").optional({ checkFalsy: true })
    .isInt({ min: 1 }).withMessage("리그는 1 이상의 정수여야 합니다."),
  body("match_date").optional({ checkFalsy: true })
    .isISO8601().withMessage("경기 날짜를 형식에 맞게 입력해주세요. (예: 2025-07-01)"),
  body("match_time").optional({ checkFalsy: true })
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("경기 시간을 형식에 맞게 입력해주세요. (예: 18:30)"),
  body("team_one").optional({ checkFalsy: true })
    .isString().withMessage("팀1은 문자열이어야 합니다."),
  body("team_two").optional({ checkFalsy: true })
    .isString().withMessage("팀2는 문자열이어야 합니다."),
  body("etc").optional({ checkFalsy: true })
    .isString().withMessage("기타는 문자열이어야 합니다."),
  validate,
];

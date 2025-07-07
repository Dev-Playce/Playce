import { body } from "express-validator";
import validate from "./validate";

export const JoinValidator = [
  body("email")
    .notEmpty()
    .withMessage("이메일을 입력해주세요.").bail()
    .isEmail()
    .withMessage("이메일 형식이 올바르지 않습니다."),
  body("password")
    .notEmpty().withMessage("비밀번호를 입력해주세요.").bail()
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다."),
  body("name").notEmpty().withMessage("이름을 입력해주세요."),
  body("nickname").notEmpty().withMessage("닉네임을 입력해주세요."),
  body("phone")
    .notEmpty().withMessage("전화번호를 입력해주세요.").bail()
    .matches(/^01[016789]-?\d{3,4}-?\d{4}$/)
    .withMessage("전화번호를 형식에 맞게 입력해주세요. (예: 01012345678/010-1234-5678)"),
  validate,
];

export const LoginValidator = [
  body("email")
    .notEmpty()
    .withMessage("이메일을 입력해주세요.").bail()
    .isEmail()
    .withMessage("이메일 형식이 올바르지 않습니다."),
  body("password")
    .notEmpty()
    .withMessage("비밀번호를 입력해주세요.").bail()
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다."),
  validate,
];

export const NicknameValidator = [
  body("nickname")
    .notEmpty()
    .withMessage("변경할 닉네임을 입력해주세요."),
  validate,
];
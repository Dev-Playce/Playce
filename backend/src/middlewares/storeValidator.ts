import { body } from "express-validator";
import validate from "./validate";

// 1. 식당 등록 시 req.body 유효성 검사
export const createStoreValidator = [
  body("store_name")
    .notEmpty()
    .withMessage("식당 이름을 입력해주세요.")
    .bail()
    .isString()
    .withMessage("식당 이름은 문자열이어야 합니다."),

  body("business_number")
    .notEmpty()
    .withMessage("사업자등록번호를 입력해주세요.")
    .bail()
    .isString()
    .withMessage("사업자등록번호는 문자열이어야 합니다.")
    .bail()
    .matches(/^\d{3}-\d{2}-\d{5}$/, "i")
    .withMessage(
      "사업자등록번호를 형식에 맞게 입력해주세요. (예: 123-45-67890)"
    ),

  body("address")
    .notEmpty()
    .withMessage("주소를 입력해주세요.")
    .bail()
    .isString()
    .withMessage("주소는 문자열이어야 합니다."),

  body("phone")
    .notEmpty()
    .withMessage("전화번호를 입력해주세요.")
    .bail()
    .isString()
    .withMessage("전화번호는 문자열이어야 합니다.")
    .bail()
    .matches(
      /^(0?(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-\d{3,4}-\d{4}|01[016789]-\d{4}-\d{4})$/,
      "i"
    )
    .withMessage(
      "전화번호를 형식에 맞게 입력해주세요. (예: 02-123-1111, 031-1234-1111, 010-1234-1111)"
    ),

  body("opening_hours")
    .notEmpty()
    .withMessage("영업 시간을 입력해주세요.")
    .bail()
    .isString()
    .withMessage("영업 시간은 문자열이어야 합니다."),

  // body("menus")
  //   .optional({ checkFalsy: true })
  //   .isArray().withMessage("메뉴는 배열이어야 합니다."),
  // body("menus.*.name")
  //   .notEmpty().withMessage("메뉴 이름을 입력해주세요.").bail()
  //   .isString().withMessage("메뉴 이름은 문자열이어야 합니다."),
  // body("menus.*.price")
  //   .notEmpty().withMessage("메뉴 가격을 입력해주세요.").bail()
  //   .isString().withMessage("메뉴 가격은 문자열이어야 합니다."),
  body("menus")
    .optional({ checkFalsy: true })
    .isString().withMessage("메뉴는 JSON 문자열이어야 합니다.")
    .custom((value, { req }) => {
      try {
        const parsedMenus = JSON.parse(value); // JSON 문자열을 파싱
        if (!Array.isArray(parsedMenus)) {
          throw new Error("메뉴는 유효한 JSON 배열이어야 합니다.");
        }
        // 파싱된 배열 내 각 객체의 유효성 검사
        for (const item of parsedMenus) {
          if (typeof item.name !== 'string' || item.name.trim() === '') {
            throw new Error("각 메뉴 항목은 비어있지 않은 'name' (문자열)을 포함해야 합니다.");
          }
          if (typeof item.price !== 'string' || item.price.trim() === '') {
            throw new Error("각 메뉴 항목은 비어있지 않은 'price' (문자열)를 포함해야 합니다.");
          }
        }
        // 유효성 검사를 통과하면 파싱된 객체를 req.body.menus에 다시 할당하여 컨트롤러에서 바로 사용 가능하게 함
        req.body.menus = parsedMenus;
        return true;
      } catch (e: any) {
        throw new Error(`메뉴 형식이 유효하지 않습니다: ${e.message}`);
      }
    }),

  body("type")
    .notEmpty()
    .withMessage("업종을 입력해주세요.")
    .bail()
    .isString()
    .withMessage("업종은 문자열이어야 합니다."),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("설명은 문자열이어야 합니다."),

  body("img_urls")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("이미지 URL 리스트는 배열이어야 합니다."),

  body("img_urls.*")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("각 이미지 URL은 유효한 형식이어야 합니다."),

  validate,
];

// 2. 식당 수정 시 req.body 유효성 검사
export const updateStoreValidator = [
  // 모든 필드는 선택적으로(optional) 받습니다.
  body("store_name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("식당 이름은 문자열이어야 합니다."),

  body("address")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("주소는 문자열이어야 합니다."),

  body("phone")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("전화번호는 문자열이어야 합니다.")
    .bail()
    .matches(
      /^(0?(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-\d{3,4}-\d{4}|01[016789]-\d{4}-\d{4})$/,
      "i"
    )
    .withMessage(
      "전화번호 형식이 올바르지 않습니다. (예: 02-123-1111, 010-1234-1111)"
    ),

  body("opening_hours")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("영업 시간은 문자열이어야 합니다."),

  // body("menus")
  //   .optional({ checkFalsy: true })
  //   .isArray().withMessage("메뉴는 배열이어야 합니다."),
  // body("menus.*.name")
  //   .notEmpty().withMessage("메뉴 이름을 입력해주세요.").bail()
  //   .isString().withMessage("메뉴 이름은 문자열이어야 합니다."),
  // body("menus.*.price")
  //   .notEmpty().withMessage("메뉴 가격을 입력해주세요.").bail()
  //   .isString().withMessage("메뉴 가격은 문자열이어야 합니다."),
  body("menus")
    .optional({ checkFalsy: true })
    .isString().withMessage("메뉴는 JSON 문자열이어야 합니다.")
    .custom((value, { req }) => {
      try {
        const parsedMenus = JSON.parse(value); // JSON 문자열을 파싱
        if (!Array.isArray(parsedMenus)) {
          throw new Error("메뉴는 유효한 JSON 배열이어야 합니다.");
        }
        // 파싱된 배열 내 각 객체의 유효성 검사
        for (const item of parsedMenus) {
          if (typeof item.name !== 'string' || item.name.trim() === '') {
            throw new Error("각 메뉴 항목은 비어있지 않은 'name' (문자열)을 포함해야 합니다.");
          }
          if (typeof item.price !== 'string' || item.price.trim() === '') {
            throw new Error("각 메뉴 항목은 비어있지 않은 'price' (문자열)를 포함해야 합니다.");
          }
        }
        // 유효성 검사를 통과하면 파싱된 객체를 req.body.menus에 다시 할당하여 컨트롤러에서 바로 사용 가능하게 함
        req.body.menus = parsedMenus;
        return true;
      } catch (e: any) {
        throw new Error(`메뉴 형식이 유효하지 않습니다: ${e.message}`);
      }
    }),

  body("type")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("업종은 문자열이어야 합니다."),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("설명은 문자열이어야 합니다."),

  body("img_urls")
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (typeof value === "string") return true; // 문자열 하나면 허용
      if (Array.isArray(value))
        return value.every((url) => typeof url === "string");
      return false;
    })
    .withMessage("img_urls는 문자열 혹은 문자열 배열이어야 합니다."),

  body("img_urls.*")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("각 이미지 URL은 유효한 형식이어야 합니다."),

  validate,
];

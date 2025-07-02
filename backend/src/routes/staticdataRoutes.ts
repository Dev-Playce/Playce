import { Router } from "express";
import staticdataController from "../controller/staticdataController";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: StaticData
 *  description: DB 조회 API
 */

/**
 * @swagger
 * /staticdata/bigRegions:
 *  get:
 *    summary: 지역 대분류 조회
 *    tags: [StaticData]
 *    responses:
 *      200:
 *        description: 지역 대분류 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 지역 대분류 조회 성공
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: 서울
 *      404:
 *        description: 해당 지역 대분류를 찾을 수 없습니다.
 */
router.get("/bigRegions", staticdataController.getBigRegions); // 지역 대분류 조회

/**
 * @swagger
 * /staticdata/smallRegions/{big_region_id}:
 *  get:
 *    summary: 지역 소분류 조회
 *    tags: [StaticData]
 *    parameters:
 *      - in: path
 *        name: big_region_id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *        description: 대분류 지역 id
 *    responses:
 *      200:
 *        description: 지역 소분류 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 지역 소분류 조회 성공
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: 강남구
 *                      big_region_id:
 *                        type: integer
 *                        example: 1
 *      400:
 *        description: 유효하지 않은 대분류 ID입니다.
 *      404:
 *        description: 해당 대분류의 소분류 지역을 찾을 수 없습니다.
 */
router.get("/smallRegions/:big_region_id", staticdataController.getSmallRegions); // 지역 소분류 조회

/**
 * @swagger
 * /staticdata/sports:
 *  get:
 *    summary: 경기 종목 조회
 *    tags: [StaticData]
 *    responses:
 *      200:
 *        description: 경기 종목 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 경기 종목 조회 성공
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: 축구
 *                      is_team_competition:
 *                        type: boolean
 *                        example: true
 *      404:
 *        description: 해당 종목을 찾을 수 없습니다.
 */
router.get("/sports", staticdataController.getSports); // 종목 조회

/**
 * @swagger
 * /staticdata/leagues/{sport_id}:
 *  get:
 *    summary: 경기 리그 조회
 *    tags: [StaticData]
 *    parameters:
 *      - in: path
 *        name: sport_id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *        description: 경기 종목 id
 *    responses:
 *      200:
 *        description: 경기 리그 조회 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                message:
 *                  type: string
 *                  example: 경기 리그 조회 성공
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      name:
 *                        type: string
 *                        example: K리그
 *                      sport_id:
 *                        type: integer
 *                        example: 1
 *      400:
 *        description: 유효하지 않은 종목 ID입니다.
 *      404:
 *        description: 해당 종목의 리그를 찾을 수 없습니다.
 */
router.get("/leagues/:sport_id", staticdataController.getLeagues); // 리그 조회

export default router;

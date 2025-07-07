import { Router } from "express";
import searchController from "../controller/searchController";
import { NearbySearchValidator } from "../middlewares/searchValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: 검색 관련 API
 */

/**
 * @swagger
 * /search/nearby:
 *   get:
 *     summary: 현재 위치 기반 식당 검색 (메인페이지)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.5665
 *         description: 현재 위치 위도
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.9780
 *         description: 현재 위치 경도
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *           example: 5
 *         description: 검색 반경 (km 단위, 기본값 5)
 *     responses:
 *       200:
 *         description: 현재 위치 기반 식당 검색 성공 또는 검색 결과 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "현재 위치 기반 검색 성공"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       store_id:
 *                         type: integer
 *                         example: 1
 *                       store_name:
 *                         type: string
 *                         example: 플레이스 강남점
 *                       type:
 *                         type: string
 *                         example: 스포츠펍
 *                       main_img:
 *                         type: string
 *                         example: https://image.com/store.jpg
 *                       address:
 *                         type: string
 *                         example: 서울특별시 강남구 테헤란로 123
 *                       lat:
 *                         type: number
 *                         example: 37.5665
 *                       lng:
 *                         type: number
 *                         example: 126.9780
 *                       broadcasts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             match_date:
 *                               type: string
 *                               format: date
 *                               example: 2025-06-24
 *                             match_time:
 *                               type: string
 *                               format: time
 *                               example: 18:30:00
 *                             sport:
 *                               type: string
 *                               example: soccer
 *                             league:
 *                               type: string
 *                               example: K League
 *                             team_one:
 *                               type: string
 *                               example: FC서울
 *                             team_two:
 *                               type: string
 *                               example: 수원삼성
 *                             etc:
 *                               type: string
 *                               example: 빅매치!
 */
router.get("/nearby", NearbySearchValidator, searchController.getNearbyStores);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: 통합 검색
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: 플레이스
 *         description: 식당 이름 검색 키워드
 *       - in: query
 *         name: sport
 *         required: false
 *         schema:
 *           type: string
 *           example: soccer
 *         description: "종목 (예: 축구, 야구 등)"
 *       - in: query
 *         name: league
 *         required: false
 *         schema:
 *           type: string
 *           example: K League
 *         description: "리그 (예: 프리미어리그)"
 *       - in: query
 *         name: team
 *         required: false
 *         schema:
 *           type: string
 *           example: FC서울
 *         description: 응원팀
 *       - in: query
 *         name: big_region
 *         required: false
 *         schema:
 *           type: string
 *           example: 서울
 *         description: 시/도 단위 지역명
 *       - in: query
 *         name: small_region
 *         required: false
 *         schema:
 *           type: string
 *           example: 강남구
 *         description: 구/군 단위 지역명
 *     responses:
 *       200:
 *         description: 통합 검색 성공 또는 검색 결과 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "통합 검색 성공"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                         description: 식당 ID
 *                       store_name:
 *                         type: string
 *                         example: 플레이스 강남점
 *                       img_url:
 *                         type: string
 *                         example: https://image.com/store.jpg
 *                       address:
 *                         type: string
 *                         example: 서울특별시 강남구 테헤란로 123
 *                       lat:
 *                         type: number
 *                         example: 37.5665
 *                       lng:
 *                         type: number
 *                         example: 126.9780
 *                       broadcast:
 *                         type: object
 *                         nullable: true
 *                         description: 최신 중계 일정 (없을 경우 null)
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           match_date:
 *                             type: string
 *                             format: date
 *                             example: 2025-06-30
 *                           match_time:
 *                             type: string
 *                             format: time
 *                             example: 18:30:00
 *                           sport:
 *                             type: string
 *                             example: soccer
 *                           league:
 *                             type: string
 *                             example: K League
 *                           team_one:
 *                             type: string
 *                             example: FC서울
 *                           team_two:
 *                             type: string
 *                             example: 수원삼성
 *                           etc:
 *                             type: string
 *                             example: 선두 경쟁 매치
 */

router.get("/", searchController.searchStores);

export default router;

import { Router } from "express";
import searchController from "../controller/searchController";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Search
 *  description: 검색 관련 API
 */

/**
 * @swagger
 * /search/nearby:
 *   get:
 *     summary: 현재 위치 기반 식당 검색 (메인페이지용)
 *     tags: [Search]
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.5665
 *         description: 현재 위치 위도
 *       - name: lng
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.9780
 *         description: 현재 위치 경도
 *       - name: radius
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 5
 *         description: 검색 반경 (km 단위, 기본값 5)
 *     responses:
 *       200:
 *         description: 인근 식당 목록 또는 결과 없음
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
 *                   example: 검색 결과가 없습니다.
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
router.get("/nearby", searchController.getNearbyStores);


/**
 * @swagger
 * /search:
 *   get:
 *     summary: 통합 검색
 *     tags: [Search]
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: 플레이스
 *         description: 식당 이름 검색 키워드
 *       - name: sport
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: soccer
 *         description: "종목 (예: 축구, 야구 등)"
 *       - name: league
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: K League
 *         description: "리그 (예: 프리미어리그)"
 *       - name: team
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: FC서울
 *         description: 응원팀
 *       - name: big_region
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: 서울
 *         description: 시/도 단위 지역명
 *       - name: small_region
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: 강남구
 *         description: 구/군 단위 지역명
 *       - name: sort
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [date, name]
 *           example: date
 *         description: 정렬 기준
 *     responses:
 *       200:
 *         description: 검색된 식당 목록 또는 검색 결과 없음
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
 *                   example: 검색 성공
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
 *                       match_id:
 *                         type: integer
 *                         example: 3
 *                         description: 가장 가까운 중계 일정 ID
 */
router.get("/", searchController.searchStores);

export default router;

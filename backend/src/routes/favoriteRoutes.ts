import { Router } from "express";
import favoriteController from "../controller/favoriteController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: 즐겨찾기 관련 API
 */

/**
 * @swagger
 * /favorites/{store_id}:
 *   post:
 *     summary: 즐겨찾기 추가
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: store_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       201:
 *         description: 즐겨찾기 추가 성공
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
 *                   example: "즐겨찾기가 추가되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     favorite_id:
 *                       type: integer
 *                       example: 3
 *                     created_at:
 *                       type: string
 *                       example: "2025-07-01 16:41:03"
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       404:
 *         description: 식당 또는 사용자를 찾을 수 없음
 *       409:
 *         description: 이미 즐겨찾기에 추가된 식당
 */
router.post("/:store_id", authenticate, favoriteController.addFavorite); // 1. 즐겨찾기 추가

/**
 * @swagger
 * /favorites/{store_id}:
 *   delete:
 *     summary: 즐겨찾기 삭제
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: store_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 즐겨찾기 삭제 성공
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
 *                   example: "즐겨찾기가 삭제되었습니다."
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       404:
 *         description: 즐겨찾기 항목 또는 사용자를 찾을 수 없음
 */
router.delete("/:store_id", authenticate, favoriteController.removeFavorite); // 2. 즐겨찾기 삭제

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: 즐겨찾기 목록 조회
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 즐겨찾기 목록 조회 성공
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
 *                   example: "즐겨찾기 목록 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     stores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: integer
 *                             example: 1
 *                           store_name:
 *                             type: string
 *                             example: "신라면옥"
 *                           main_img:
 *                             type: string
 *                             example: "https://cdn.example.com/image.jpg"
 *                           address:
 *                             type: string
 *                             example: "서울시 강남구"
 *                           type:
 *                             type: string
 *                             example: "한식"
 *                           created_at:
 *                             type: string
 *                             example: "2025-07-01 16:41:03"
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get("/", authenticate, favoriteController.getFavorites); // 3. 즐겨찾기 목록 조회

export default router;

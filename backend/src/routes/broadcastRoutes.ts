import { Router } from 'express';
import broadcastController from '../controller/broadcastController';
import { authenticate } from '../middlewares/authMiddleware';
import { createBroadcastValidator, updateBroadcastValidator } from "../middlewares/broadcastValidator";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Broadcasts
 *   description: 중계 일정 관련 API
 */

/**
 * @swagger
 * /broadcasts:
 *   post:
 *     summary: 중계 일정 등록
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [store_id, match_date, match_time, sport_id, league_id]
 *             properties:
 *               store_id:
 *                 type: integer
 *                 example: 1
 *               match_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               match_time:
 *                 type: string
 *                 format: time
 *                 example: "18:30"
 *               sport_id:
 *                 type: integer
 *                 example: 1
 *               league_id:
 *                 type: integer
 *                 example: 1
 *               team_one:
 *                 type: string
 *                 example: "FC Seoul"
 *               team_two:
 *                 type: string
 *                 example: "Suwon Samsung"
 *               etc:
 *                 type: string
 *                 example: "비고 내용"
 *     responses:
 *       201:
 *         description: 중계 일정 등록 성공
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
 *                   example: "중계 일정이 등록되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     broadcast_id:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: 해당 스포츠는 팀 이름을 입력할 필요가 없습니다.
*/
router.post('/', authenticate, createBroadcastValidator, broadcastController.createBroadcast);

/**
 * @swagger
 * /broadcasts/{broadcasts_id}:
 *   delete:
 *     summary: 중계 일정 삭제
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: broadcasts_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 중계 일정 삭제 성공
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
 *                   example: "중계 일정이 삭제되었습니다."
 */
router.delete('/:broadcasts_id', authenticate, broadcastController.deleteBroadcast);

/**
 * @swagger
 * /broadcasts/{broadcasts_id}:
 *   patch:
 *     summary: 중계 일정 수정
 *     tags: [Broadcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: broadcasts_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               match_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               match_time:
 *                 type: string
 *                 format: time
 *                 example: "20:00"
 *               sport_id:
 *                 type: integer
 *                 example: 1
 *               league_id:
 *                 type: integer
 *                 example: 1
 *               team_one:
 *                 type: string
 *                 example: "LG Twins"
 *               team_two:
 *                 type: string
 *                 example: "Doosan Bears"
 *               etc:
 *                 type: string
 *                 example: "우천시 취소"
 *     responses:
 *       200:
 *         description: 중계 일정 수정 성공
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
 *                   example: "중계 일정이 수정되었습니다."
 */
router.patch('/:broadcasts_id', authenticate, updateBroadcastValidator, broadcastController.updateBroadcast);

/**
 * @swagger
 * /broadcasts/stores/{store_id}:
 *   get:
 *     summary: 특정 식당의 중계 일정 목록 조회
 *     tags: [Broadcasts]
 *     parameters:
 *       - in: path
 *         name: store_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: 중계 일정 목록 조회 성공
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
 *                   example: "중계 일정 목록 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     broadcasts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           broadcast_id:
 *                             type: integer
 *                             example: 1
 *                           match_date:
 *                             type: string
 *                             example: "2025-07-01"
 *                           match_time:
 *                             type: string
 *                             example: "18:30"
 *                           sport:
 *                             type: string
 *                             example: "야구"
 *                           league:
 *                             type: string
 *                             example: "KBO"
 *                           team_one:
 *                             type: string
 *                             example: "LG Twins"
 *                           team_two:
 *                             type: string
 *                             example: "Doosan Bears"
 *                           etc:
 *                             type: string
 *                             example: "비고 내용"
 */
router.get('/stores/:store_id', broadcastController.getBroadcastsByStore);

export default router;

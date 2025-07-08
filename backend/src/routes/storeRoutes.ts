import { Router } from "express";
import storeController from "../controller/storeController";
import {
  authenticate,
  optionalAuthenticate,
} from "../middlewares/authMiddleware";
import {
  createStoreValidator,
  updateStoreValidator,
} from "../middlewares/storeValidator";
import { uploadToS3 } from "../utils/s3";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Store
 *  description: 식당 관련 API
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: 식당 등록 (이미지 포함)
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - store_name
 *               - business_number
 *               - address
 *               - phone
 *               - opening_hours
 *               - menus
 *               - type
 *               - images
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: 펍 카와우소
 *               business_number:
 *                 type: string
 *                 example: 444-44-12345
 *               address:
 *                 type: string
 *                 example: 서울특별시 중구 세종대로 80 지하1층
 *               phone:
 *                 type: string
 *                 example: 02-1234-5678
 *               opening_hours:
 *                 type: string
 *                 example: 매일 11:00 ~ 24:00
 *               menus:
 *                 type: string
 *                 example: 뇨끼, 샐러드, 피시 앤 칩스
 *               type:
 *                 type: string
 *                 example: 펍
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: 축구 경기 생중계가 있는 강남 최고의 스포츠펍
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 식당이 등록되었습니다.
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
 *                   example: 식당이 등록되었습니다. (이미지 3개 업로드됨)
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: req.body 유효성 검사 실패 또는 유효하지 않은 사업자등록번호/지역
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       409:
 *         description: 이미 등록된 사업자등록번호
 */
router.post(
  "/",
  authenticate,
  uploadToS3.array("images", 5),
  storeController.registerStore
); // 식당 등록 (토큰 검사)

/**
 * @swagger
 * /stores/mypage:
 *   get:
 *     summary: 내 식당 목록 조회 (마이페이지)
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자가 등록한 식당 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       store_id:
 *                         type: integer
 *                         example: 1
 *                         description: 식당 고유 ID
 *                       store_name:
 *                         type: string
 *                         example: 플레이스 강남점
 *                         description: 식당 이름
 *                       main_img:
 *                         type: string
 *                         example: https://image.com/1.jpg
 *                         description: 식당 대표 사진 URL
 *                       address:
 *                         type: string
 *                         example: 서울특별시 강남구 테헤란로 123
 *                         description: 식당 주소
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get("/mypage", authenticate, storeController.getMyStores); // 5. 내 식당 목록 조회 (🔒) <- 라우팅 순서 문제로 위치 수정

/**
 * @swagger
 * /stores/{storeId}:
 *   patch:
 *     summary: 식당 정보 수정
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 식당의 고유 ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: 교촌치킨 서울시청점
 *               address:
 *                 type: string
 *                 example: 서울 중구 세종대로18길 6 1-2층
 *               phone:
 *                 type: string
 *                 example: 010-1111-1234
 *               opening_hours:
 *                 type: string
 *                 example: 매일 12:00 ~ 24:00
 *               menus:
 *                 type: string
 *                 example: 교촌 오리지날
 *               type:
 *                 type: string
 *                 example: 치킨
  *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 새로 추가할 이미지 파일들
 *               description:
 *                 type: string
 *                 example: 설명
 *     responses:
 *       200:
 *         description: 식당이 수정되었습니다.
 *       400:
 *         description: req.body 유효성 검사 실패 혹은 수정할 수 없는 항목 포함
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       403:
 *         description: 식당에 대한 수정 권한 없음
 *       404:
 *         description: 식당/사용자를 찾을 수 없음
 */
router.patch(
  "/:storeId",
  authenticate,
  uploadToS3.array("images", 5),
  updateStoreValidator,
  storeController.updateStore
); // 2. 식당 수정 (🔒)

/**
 * @swagger
 * /stores/{storeId}:
 *   delete:
 *     summary: 식당 삭제
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *         description: 삭제할 식당의 고유 ID
 *     responses:
 *       200:
 *         description: 식당이 삭제되었습니다.
 *       401:
 *         description: 잘못된 인증 형식 또는 유효하지 않은 토큰
 *       403:
 *         description: 식당에 대한 삭제 권한 없음
 *       404:
 *         description: 식당/사용자를 찾을 수 없음
 */
router.delete("/:storeId", authenticate, storeController.deleteStore); // 3. 식당 삭제 (🔒)

/**
 * @swagger
 * /stores/{storeId}:
 *   get:
 *     summary: 식당 상세 조회
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: storeId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: 식당 고유 ID
 *     responses:
 *       200:
 *         description: 식당 상세 정보 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 store_name:
 *                   type: string
 *                   example: 플레이스 강남점
 *                 address:
 *                   type: string
 *                   example: 서울특별시 강남구 테헤란로 123
 *                 phone:
 *                   type: string
 *                   example: 02-1234-5678
 *                 opening_hours:
 *                   type: string
 *                   example: 매일 10:00 ~ 23:00
 *                 menus:
 *                   type: string
 *                   example: 맥주, 피자, 치킨
 *                 type:
 *                   type: string
 *                   example: 스포츠펍
 *                 img_urls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["https://image.com/1.jpg", "https://image.com/2.jpg"]
 *                 description:
 *                   type: string
 *                   example: EPL 생중계 가능!
 *                 broadcasts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       match_date:
 *                         type: string
 *                         format: date
 *                         example: 2025-06-30
 *                       match_time:
 *                         type: string
 *                         format: time
 *                         example: 20:00:00
 *                       sport:
 *                         type: string
 *                         example: soccer
 *                       league:
 *                         type: string
 *                         example: K League
 *                       team_one:
 *                         type: string
 *                         example: FC서울
 *                       team_two:
 *                         type: string
 *                         example: 수원삼성
 *                       etc:
 *                         type: string
 *                         example: 경기 후 이벤트 있음
 *       404:
 *         description: 식당을 찾을 수 없음
 */
router.get("/:storeId", optionalAuthenticate, storeController.getStoreDetail); // 4. 식당 상세 조회 (🔓 optional 토큰 검사)

export default router;

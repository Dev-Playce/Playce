import "dotenv/config";
import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// TypeORM 설정
import { AppDataSource } from "./data-source";

// 스웨거
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

// 라우터
import userRoutes from "./routes/userRoutes";
import storeRoutes from "./routes/storeRoutes";
import searchRoutes from "./routes/searchRoutes";
import broadcastRoutes from "./routes/broadcastRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import staticdataRoutes from "./routes/staticdataRoutes";

//헬퍼
import { fail } from "./utils/response";

const app = express();
const port = Number(process.env.PORT) || 3000;
// const port = process.env.PORT || 3000;

// ✅ CORS 허용
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:3000', 'http://3.35.146.155:3000'], // 배포 시 도메인 설정 가능
  credentials: true,
}));


app.use(express.json());

// 라우터 등록
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // 스웨거

app.use("/users", userRoutes); // 유저
app.use("/stores", storeRoutes); // 식당
app.use("/search", searchRoutes); // 검색
app.use("/broadcasts", broadcastRoutes); // 중계 일정
app.use("/favorites", favoriteRoutes); // 즐겨찾기
app.use("/staticdata", staticdataRoutes); // 지역/경기 관련

// 정의되지 않은 라우터 -> 404 에러 처리
app.use((req: Request, res: Response, next: NextFunction) => {
  return fail(res, "Not Found", 404);
});

//  전역 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "서버 내부 오류입니다.";

  return fail(res, message, status);
});



AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB 연결 성공(TypeORM)");
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 서버 실행 중 : http://3.35.146.155:${port}`);
      console.log(`💡 Swagger 문서 :  http://3.35.146.155:${port}/api-docs`);
    });
  })
  .catch((error: any) => {
    console.error("❌ DB 연결 실패:", error);
  });



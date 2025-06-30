import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";

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
import { fail } from "./utils/response";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// 라우터 등록
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // 스웨거

app.use("/users", userRoutes); // 유저
app.use("/stores", storeRoutes); // 식당
app.use("/search", searchRoutes); // 검색
app.use("/broadcasts", broadcastRoutes); // 중계 일정
app.use("/favorites", favoriteRoutes); // 즐겨찾기

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

// TypeORM 연결 후 서버 실행
AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB 연결 성공(TypeORM)");
    app.listen(port, () => {
      console.log(`🚀 서버 실행 중 : http://localhost:${port}`);
      console.log(`💡 Swagger 문서 : http://localhost:${port}/api-docs`);
    });
  })
  .catch((error: any) => {
    console.error("❌ DB 연결 실패:", error);
  });

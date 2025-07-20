import path from "path";
import dotenv from "dotenv";
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}
console.log(
  `설정 : .env${
    process.env.NODE_ENV ? `.${process.env.NODE_ENV} 파일` : " 파일"
  }, log(${
    process.env.LOG_ENABLED !== "false" ? "활성화" : "비활성화"
  }), 식당 관련 지역 데이터(${
    process.env.MOCK_GEOCODING === "true" ? "mock 데이터 사용" : "kakaoAPI 사용"
  })`
);

import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "./utils/logger";

import { AppDataSource } from "./data-source";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger";

import userRoutes from "./routes/userRoutes";
import storeRoutes from "./routes/storeRoutes";
import searchRoutes from "./routes/searchRoutes";
import broadcastRoutes from "./routes/broadcastRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import staticdataRoutes from "./routes/staticdataRoutes";

import { fail } from "./utils/response";

const app = express();
const port = Number(process.env.PORT) || 3000;

const BACKEND_LOCAL_URL = process.env.BACKEND_LOCAL_URL || "http://localhost:3000";
const BACKEND_PROD_URL = process.env.BACKEND_PROD_URL;

app.use(
  cors({
    origin: [
      BACKEND_LOCAL_URL,
      BACKEND_PROD_URL,
      process.env.FRONTEND_LOCAL_URL,
      process.env.FRONTEND_PROD_URL,
    ].filter(Boolean) as string[],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../../public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/search", searchRoutes);
app.use("/broadcasts", broadcastRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/staticdata", staticdataRoutes);
app.get("/{*any}", (req, res, next) => {
  const indexPath = path.resolve(__dirname, "../../public", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      next(err);
    }
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  return fail(res, "Not Found", 404);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🚨 전역 에러:", err);

  const status = err.status || 500;
  const message = err.message || "서버 내부 오류입니다.";

  return fail(res, message, status);
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB 연결 성공(TypeORM)");
    app.listen(port, "0.0.0.0", () => {
      logger.info("✅ 서버 실행됨 (CloudWatch 연동 확인)");
      console.log(`🚀 서버 실행 중 : ${BACKEND_PROD_URL || BACKEND_LOCAL_URL}`);
      console.log(`💡 Swagger 문서 : ${BACKEND_PROD_URL || BACKEND_LOCAL_URL}/api-docs`);
    });
  })
  .catch((error: any) => {
    console.error("❌ DB 연결 실패:", error);
  });
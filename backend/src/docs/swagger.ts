import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Playce API",
        version: "1.0.0",
        description: "Playce 서비스 API 명세서",
    },
    servers: [
      {
          url: process.env.BACKEND_PROD_URL,
          description: "EC2 배포 서버",
      },
      {
        url: process.env.BACKEND_LOCAL_URL,
        description: "로컬 개발 서버",
      },
    ],
    components: { // 토큰 인증 
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // JSDoc 주석을 읽어올 경로
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
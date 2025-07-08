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
            url: "http://3.35.146.155:3000",
            description: "EC2 배포 서버",
        }
    ],
    // 토큰 인증 
    components: {
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
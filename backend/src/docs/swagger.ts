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
            url: `http://localhost:${process.env.PORT || 3000}`,
            description: "local server",
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
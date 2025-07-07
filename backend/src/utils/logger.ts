import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const logger = winston.createLogger({
    transports: [
        new WinstonCloudWatch({
            logGroupName: 'playce-backend-logs',
            logStreamName: 'backend-log-stream',
            awsRegion: process.env.AWS_REGION,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
            awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
        }),
    ],
});

export default logger;

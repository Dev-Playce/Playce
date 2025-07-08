import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

// S3 클라이언트 생성
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// 허용 확장자 설정
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

// multer-s3 설정
export const uploadToS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, `images/${filename}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('지원하지 않는 파일 형식입니다. (jpg, png, webp만 허용)'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// S3 객체 삭제 함수 
export const deleteS3Object = async (url: string) => {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME!;
    const key = decodeURIComponent(new URL(url).pathname.slice(1)); // images/파일명.jpg

    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log(`🗑️ S3 이미지 삭제 완료: ${key}`);
  } catch (err) {
    console.error(`❌ S3 이미지 삭제 실패`, err);
  }
};
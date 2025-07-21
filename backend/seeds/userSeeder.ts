import { AppDataSource } from "../src/data-source";
import { User } from "../src/entities/User";

const users = [
  {
    email: "hong@mail.com",
    password: "$2b$10$YS2cVEII/25bYv6puaYlxumw.eVBXJ8uRoPjr8LWX3CZ/3XXfQcM2",
    name: "홍길동",
    nickname: "hong",
    phone: "010-1111-1111",
  },
  {
    email: "kim@mail.com",
    password: "$2b$10$wO5V5JreoUn28X0SQhER7O3CH.T06Zte4/Rymx9b2RQBfU1HZqCJe",
    name: "김민수",
    nickname: "kim",
    phone: "010-2222-2222",
  },
  {
    email: "lee@mail.com",
    password: "$2b$10$Kkmc0qERXx97L1uETmxXYOblpqLiMdCkcHpQc3oKh81AKAwgHFRnm",
    name: "이민수",
    nickname: "lee",
    phone: "010-3333-3333",
  },
  {
    email: "park@mail.com",
    password: "$2b$10$6dMGUzfHNJfQYxcaLE.FJ.Tz9FFCH1okaWNwF/d/voG3C9R1X0bj6",
    name: "박민수",
    nickname: "park",
    phone: "010-4444-4444",
  },
  {
    email: "choi@mail.com",
    password: "$2b$10$kEvPaDFhVdLy/2PHavpMpO2rtv04ZNHfLVwq1IHbUApWCPCxtag9C",
    name: "최민수",
    nickname: "choi",
    phone: "010-5555-5555",
  },
  {
    email: "jung@mail.com",
    password: "$2b$10$gLs.Km7b17HPpLM4PfBNo.jCXNgc8UwChXuqqlbsU4aHmTnZDJFIq",
    name: "정민수",
    nickname: "jung",
    phone: "010-6666-6666",
  },
  {
    email: "jang@mail.com",
    password: "$2b$10$KCegaYtFZPjpuqsLQrwt2uDC/jsHpmDlLrVvCl49xMNrVbOrU.E.2",
    name: "장민수",
    nickname: "jang",
    phone: "010-7777-7777",
  },
  {
    email: "yoon@mail.com",
    password: "$2b$10$SHwZeTNiu19tZpbWc23kPuC9sTCEZJzpGu.SYIgSHCLaKyWrtspR2",
    name: "윤민수",
    nickname: "yoon",
    phone: "010-8888-8888",
  },
  {
    email: "han@mail.com",
    password: "$2b$10$r4UyqFImdhLQGkQxBNStDuG3BN1HVLGVIhbD2oHPvx7Km8a4/XUaS",
    name: "한민수",
    nickname: "han",
    phone: "010-9999-9999",
  },
  {
    email: "seo@mail.com",
    password: "$2b$10$1yrVg9v8nkuBXgXXGFwm6Oj9n.EAF1WkYztaSuP/wn2Jerqyk8f8e",
    name: "서민수",
    nickname: "seo",
    phone: "010-0000-0000",
  },
];

export const seedUsers = async () => {
  const userRepo = AppDataSource.getRepository(User);

  for (const item of users) {
    const user = userRepo.create(item);
    await userRepo.save(user);
  }

  console.log("✅ 유저 시드 완료");
};

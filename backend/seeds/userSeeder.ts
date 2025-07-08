import { AppDataSource } from "../src/data-source";
import { User } from "../src/entities/User";

const users = [
  {
    email: "hong@mail.com",
    password: "$2b$10$YS2cVEII/25bYv6puaYlxumw.eVBXJ8uRoPjr8LWX3CZ/3XXfQcM2", // 111111
    name: "홍길동",
    nickname: "hong",
    phone: "010-1111-1111",
  },
  {
    email: "kim@mail.com",
    password: "$2b$10$wO5V5JreoUn28X0SQhER7O3CH.T06Zte4/Rymx9b2RQBfU1HZqCJe", // 222222
    name: "김민수",
    nickname: "kim",
    phone: "010-2222-2222",
  },
  {
    email: "lee@mail.com",
    password: "$2b$10$Kkmc0qERXx97L1uETmxXYOblpqLiMdCkcHpQc3oKh81AKAwgHFRnm", // 333333
    name: "이민수",
    nickname: "lee",
    phone: "010-3333-3333",
  },
  {
    email: "park@mail.com",
    password: "$2b$10$6dMGUzfHNJfQYxcaLE.FJ.Tz9FFCH1okaWNwF/d/voG3C9R1X0bj6", // 444444
    name: "박민수",
    nickname: "park",
    phone: "010-4444-4444",
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
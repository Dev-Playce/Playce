import { AppDataSource } from "../src/data-source";
import { User } from "../src/entities/User";

const users = [
  {
    email: "hong@test.com",
    password: "111111",
    name: "홍길동",
    nickname: "hong",
    phone: "010-1111-1111",
  },
  {
    email: "kim@test.com",
    password: "222222",
    name: "김민수",
    nickname: "kim",
    phone: "010-2222-2222",
  },
  {
    email: "lee@test.com",
    password: "333333",
    name: "이민수",
    nickname: "lee",
    phone: "010-3333-3333",
  },
  {
    email: "park@test.com",
    password: "444444",
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
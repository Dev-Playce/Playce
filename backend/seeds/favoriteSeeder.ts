import { AppDataSource } from "../src/data-source";
import { Favorite } from "../src/entities/Favorite";

const favorites = [
  { user: { id: 1 }, store: { id: 1 } },
  { user: { id: 2 }, store: { id: 2 } },
  { user: { id: 3 }, store: { id: 3 } },
  { user: { id: 4 }, store: { id: 4 } },
  { user: { id: 5 }, store: { id: 5 } },
  { user: { id: 1 }, store: { id: 6 } },
  { user: { id: 2 }, store: { id: 7 } },
  { user: { id: 3 }, store: { id: 8 } },
  { user: { id: 4 }, store: { id: 9 } },
  { user: { id: 5 }, store: { id: 10 } },
  { user: { id: 1 }, store: { id: 11 } },
  { user: { id: 2 }, store: { id: 12 } },
  { user: { id: 3 }, store: { id: 13 } },
  { user: { id: 4 }, store: { id: 14 } },
  { user: { id: 5 }, store: { id: 15 } },
];

export const seedFavorites = async () => {
  const favoriteRepo = AppDataSource.getRepository(Favorite);

  for (const item of favorites) {
    const favorite = favoriteRepo.create(item);
    await favoriteRepo.save(favorite);
  }

  console.log("✅ 즐겨찾기 시드 완료");
};

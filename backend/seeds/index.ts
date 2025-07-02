import "reflect-metadata";
import { AppDataSource } from "../src/data-source";

import { seedBusinessNumbers } from "./businessNumberSeeder";
import { seedRegions } from "./regionSeeder";
import { seedSportLeagues } from "./sportLeagueSeeder";

import { seedUsers } from "./userSeeder";
import { seedStores } from "./storeSeeder";
import { seedBroadcasts } from "./broadcastSeeder";
import { seedFavorites } from "./favoriteSeeder";


const runSeeders = async () => {
  await AppDataSource.initialize();
  console.log("📦 DB 연결");

  try {
    await seedBusinessNumbers();
    await seedRegions();
    await seedSportLeagues();

    await seedUsers();
    await seedStores();
    await seedBroadcasts();
    await seedFavorites();

    console.log("🌱 Seed 완료");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed 오류: ", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
};

runSeeders();
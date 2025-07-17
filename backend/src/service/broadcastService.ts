import { AppDataSource } from "../data-source";
import { Broadcast } from "../entities/Broadcast";
import { Store } from "../entities/Store";
import { Sport } from "../entities/Sport";
import { League } from "../entities/League";
import { createError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/redis";

const broadcastRepo = AppDataSource.getRepository(Broadcast);
const storeRepo = AppDataSource.getRepository(Store);
const sportRepo = AppDataSource.getRepository(Sport);
const leagueRepo = AppDataSource.getRepository(League);

// 식당 소유권 확인
const checkStoreOwnership = async (storeId: number, userId: number) => {
  log(`\n🔍 [식당 소유권 확인] storeId: ${storeId}, userId: ${userId}`);
  const store = await storeRepo.findOne({
    where: { id: storeId },
    relations: ["user"],
  });
  if (!store) throw createError("존재하지 않는 식당입니다.", 404);
  if (store.user.id !== userId)
    throw createError("해당 식당에 대한 권한이 없습니다.", 403);
  log("✅ 식당 소유권 확인 완료");
  return store;
};

// 중계 일정 생성
const createBroadcast = async (data: any, userId: number) => {
  log("\n📺 [중계 일정 등록] 시작");
  const store = await checkStoreOwnership(data.store_id, userId);

  const sport = await sportRepo.findOneBy({ id: data.sport_id });
  if (!sport) throw createError("존재하지 않는 스포츠입니다.", 404);

  const league = await leagueRepo.findOneBy({ id: data.league_id });
  if (!league) throw createError("존재하지 않는 리그입니다.", 404);

  if (!sport.isTeamCompetition) {
    if (data.team_one || data.team_two) {
      throw createError(
        `해당 스포츠(${sport.name})는 팀 이름을 입력할 필요가 없습니다.`,
        400
      );
    }
    data.team_one = undefined;
    data.team_two = undefined;
  }

  const newBroadcast = broadcastRepo.create({
    store,
    sport,
    league,
    matchDate: data.match_date,
    matchTime: data.match_time?.slice(0, 5),
    teamOne: data.team_one,
    teamTwo: data.team_two,
    etc: data.etc,
  });

  await broadcastRepo.save(newBroadcast);
  log(`✅ 중계 일정 등록 완료 (broadcastId: ${newBroadcast.id})`);

  // Redis 캐시 무효화
  await deleteCacheByPattern(`store:${store.id}:owner:*`); // 식당 상세 조회
  await deleteCache(`broadcasts:store:${store.id}`); // 중계 일정 목록 조회
  await deleteCacheByPattern('search:filters:*'); // 통합 검색

  return newBroadcast;
};

// 중계 일정 수정
const updateBroadcast = async (broadcastId: number, data: any, userId: number) => {
  log(`\n✏️ [중계 일정 수정] broadcastId: ${broadcastId}`);
  const broadcast = await broadcastRepo.findOne({
    where: { id: broadcastId },
    relations: ["store", "store.user", "sport", "league"],
  });
  if (!broadcast) throw createError("해당 중계 일정을 찾을 수 없습니다.", 404);
  if (broadcast.store.user.id !== userId)
    throw createError("해당 중계 일정의 수정 권한이 없습니다.", 403);

  if (data.sport_id) {
    const sport = await sportRepo.findOneBy({ id: data.sport_id });
    if (!sport) throw createError("해당 스포츠를 찾을 수 없습니다.", 404);
    broadcast.sport = sport;
  }

  if (data.league_id) {
    const league = await leagueRepo.findOneBy({ id: data.league_id });
    if (!league) throw createError("해당 리그를 찾을 수 없습니다.", 404);
    broadcast.league = league;
  }

  broadcast.matchDate = data.match_date ?? broadcast.matchDate;
  broadcast.matchTime = data.match_time?.slice(0, 5) ?? broadcast.matchTime;
  broadcast.teamOne = data.team_one ?? broadcast.teamOne;
  broadcast.teamTwo = data.team_two ?? broadcast.teamTwo;
  broadcast.etc = data.etc ?? broadcast.etc;

  await broadcastRepo.save(broadcast);
  log(`✅ 중계 일정 수정 완료 (broadcastId: ${broadcast.id})`);

  // Redis 캐시 무효화
  await deleteCacheByPattern(`store:${broadcast.store.id}:owner:*`);
  await deleteCache(`broadcasts:store:${broadcast.store.id}`);
  await deleteCacheByPattern('search:filters:*');

  return broadcast;
};

// 중계 일정 삭제
const deleteBroadcast = async (broadcastId: number, userId: number) => {
  log(`\n🗑️ [중계 일정 삭제] broadcastId: ${broadcastId}`);
  const broadcast = await broadcastRepo.findOne({
    where: { id: broadcastId },
    relations: ["store", "store.user"],
  });
  if (!broadcast) throw createError("삭제할 중계 일정이 없습니다.", 404);
  if (broadcast.store.user.id !== userId)
    throw createError("해당 중계 일정의 삭제 권한이 없습니다.", 403);

  await broadcastRepo.delete(broadcastId);
  log("✅ 중계 일정 삭제 완료");

  // Redis 캐시 무효화
  await deleteCacheByPattern(`store:${broadcast.store.id}:owner:*`);
  await deleteCache(`broadcasts:store:${broadcast.store.id}`);
  await deleteCacheByPattern('search:filters:*');
};

// 중계 일정 목록 조회 (Redis 캐시 사용)
const getBroadcastsByStore = async (storeId: number) => {
  const cacheKey = `broadcasts:store:${storeId}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    log("📦 Redis 캐시 사용 (중계 일정)");
    return cached;
  }

  const broadcasts = await broadcastRepo.find({
    where: { store: { id: storeId } },
    relations: ["sport", "league"],
    order: { matchDate: "ASC", matchTime: "ASC" },
  });

  const responseData = broadcasts.map((b) => ({
    broadcast_id: b.id,
    match_date: b.matchDate,
    match_time: b.matchTime.slice(0, 5),
    sport: b.sport.name,
    league: b.league.name,
    team_one: b.teamOne,
    team_two: b.teamTwo,
    etc: b.etc,
  }));

  await setCache(cacheKey, responseData);
  log(`✅ 조회 완료 - ${broadcasts.length}건 (캐시 저장)`);

  return responseData;
};

export default {
  createBroadcast,
  updateBroadcast,
  deleteBroadcast,
  getBroadcastsByStore,
};
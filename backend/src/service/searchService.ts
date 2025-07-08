import { AppDataSource } from "../data-source";
import { Store } from "../entities/Store";
import { createError } from "../utils/createError";

const searchService = {
  // ✅ 현재 위치 기반 검색
  getNearbyStores: async (lat: number, lng: number, radius: number = 5) => {
    console.log(`\n📍 [현재 위치 검색] lat: ${lat}, lng: ${lng}, radius: ${radius}km`);

    const storeRepo = AppDataSource.getRepository(Store);

    const stores = await storeRepo
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.images", "image", "image.isMain = true")
      .leftJoinAndSelect("store.broadcasts", "broadcast")
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .addSelect(`
        (6371 * acos(
          cos(radians(:lat))
          * cos(radians(store.lat))
          * cos(radians(store.lng) - radians(:lng))
          + sin(radians(:lat))
          * sin(radians(store.lat))
        ))
      `, "distance")
      .where(`
        (6371 * acos(
          cos(radians(:lat))
          * cos(radians(store.lat))
          * cos(radians(store.lng) - radians(:lng))
          + sin(radians(:lat))
          * sin(radians(store.lat))
        )) <= :radius
      `, { lat, lng, radius })
      .getMany();

    console.log(`- 검색 결과: ${stores.length}개`);

    const result = stores.map((store) => ({
      store_id: store.id,
      store_name: store.storeName,
      type: store.type,
      main_img: store.images[0]?.imgUrl ?? null,
      address: store.address,
      lat: store.lat,
      lng: store.lng,
      broadcasts: store.broadcasts.map((b) => ({
        match_date: b.matchDate,
        match_time: b.matchTime,
        sport: b.sport.name,
        league: b.league.name,
        team_one: b.teamOne,
        team_two: b.teamTwo,
        etc: b.etc,
      })),
    }));

    console.log("✅ 현재 위치 검색 완료");
    return result;
  },

  // ✅ 통합 검색
  searchStores: async (filters: {
    search?: string;
    sport?: string;
    league?: string;
    team?: string;
    big_region?: string;
    small_region?: string;
    // sort?: "date" | "name";
  }) => {
    console.log("\n🔎 [통합 검색] 요청 필터:", filters);

    const {
      search,
      sport,
      league,
      team,
      big_region,
      small_region,
      // sort,
    } = filters;

    const storeRepo = AppDataSource.getRepository(Store);

    const query = storeRepo
      .createQueryBuilder("store")
      .leftJoinAndSelect("store.images", "image", "image.isMain = true")
      .leftJoinAndSelect("store.broadcasts", "broadcast")
      .leftJoinAndSelect("broadcast.sport", "sport")
      .leftJoinAndSelect("broadcast.league", "league")
      .leftJoinAndSelect("store.bigRegion", "bigRegion")
      .leftJoinAndSelect("store.smallRegion", "smallRegion");

    // 🔍 필터 처리
    if (search) {
      console.log(`- 필터: 검색어 '${search}'`);
      query.andWhere(
        "store.storeName LIKE :search OR store.address LIKE :search",
        { search: `%${search}%` }
      );
    }

    if (sport) {
      console.log(`- 필터: 스포츠 '${sport}'`);
      query.andWhere("sport.name = :sport", { sport });
    }

    if (league && league !== "전체" && league !== "all") {
      console.log(`- 필터: 리그 '${league}'`);
      query.andWhere("league.name = :league", { league });
    }

    if (team) {
      console.log(`- 필터: 팀 '${team}'`);
      query.andWhere(
        "broadcast.teamOne = :team OR broadcast.teamTwo = :team",
        { team }
      );
    }

    if (big_region) {
      console.log(`- 필터: 대지역 '${big_region}'`);
      query.andWhere("bigRegion.name = :bigRegion", { bigRegion: big_region });
    }

    if (small_region && small_region !== "전체" && small_region !== "all") {
      query.andWhere("smallRegion.name = :smallRegion", { smallRegion: small_region });
    } else {
      console.log("- 필터: 소지역 전체 (필터 생략)");
    }

    // // 🔃 정렬
    // if (sort === "date") {
    //   console.log("- 정렬: 날짜순");
    //   query.orderBy("broadcast.matchDate", "ASC");
    // } else if (sort === "name") {
    //   console.log("- 정렬: 이름순");
    //   query.orderBy("store.storeName", "ASC");
    // }

    const stores = await query.getMany();

    console.log(`- 검색 결과: ${stores.length}개`);

    const result = stores.map((store) => {
      // 최신 중계 일정 1개 추출
      const latestBroadcast = store.broadcasts
        .slice()
        .sort((a, b) => {
          const aDate = new Date(`${a.matchDate}T${a.matchTime}`);
          const bDate = new Date(`${b.matchDate}T${b.matchTime}`);
          return bDate.getTime() - aDate.getTime(); // 최신순
        })[0];

      return {
        id: store.id,
        store_name: store.storeName,
        img_url: store.images[0]?.imgUrl ?? null,
        address: store.address,
        lat: store.lat,
        lng: store.lng,
        broadcast: latestBroadcast
          ? {
            id: latestBroadcast.id,
            match_date: latestBroadcast.matchDate,
            match_time: latestBroadcast.matchTime,
            sport: latestBroadcast.sport?.name,
            league: latestBroadcast.league?.name,
            team_one: latestBroadcast.teamOne,
            team_two: latestBroadcast.teamTwo,
            etc: latestBroadcast.etc,
          }
          : null, // 중계 일정이 없을 경우 null
      };
    });

    console.log("✅ 통합 검색 완료");
    return result;
  },
};

export default searchService;

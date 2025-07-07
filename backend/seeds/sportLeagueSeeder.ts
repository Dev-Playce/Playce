import { AppDataSource } from "../src/data-source";
import { Sport } from "../src/entities/Sport";
import { League } from "../src/entities/League";

const sportsData = {
  축구: { is_team_competition: true, leagues: [
    "K리그 1",
    "라리가",
    "리그 1",
    "분데스리가",
    "세리에 A",
    "UEFA 챔피언스리그",
    "올림픽",
    "월드컵",
    "프리미어리그"
  ] },
  야구: { is_team_competition: true, leagues: ["KBO 리그", "MLB", "NPB", "올림픽"] },
  농구: { is_team_competition: true, leagues: ["KBL", "NBA", "WKBL", "올림픽"] },
  배구: { is_team_competition: true, leagues: ["V-리그", "올림픽"] },
  골프: { is_team_competition: false, leagues: ["KLPGA 투어", "KPGA 코리안 투어", "LPGA 투어", "올림픽", "PGA 리그"] },
  격투기: { is_team_competition: true, leagues: ["UFC", "올림픽"] },
  e스포츠: { is_team_competition: true, leagues: ["LCK", "올림픽"] }
};

export const seedSportLeagues = async () => {
  const sportRepo = AppDataSource.getRepository(Sport);
  const leagueRepo = AppDataSource.getRepository(League);

  for (const [sportName, { is_team_competition, leagues }] of Object.entries(sportsData)) {
      const sport = sportRepo.create({ name: sportName, isTeamCompetition: is_team_competition });
      await sportRepo.save(sport);
      // console.log(`   ✅ 종목 삽입 성공: ${sportName}`);

      for (const leagueName of leagues) {
        const league = leagueRepo.create({
          name: leagueName,
          sport,
        });
        await leagueRepo.save(league);
        // console.log(`   ✅ 리그 삽입 성공: ${leagueName} (종목: ${sportName})`); 
      }
    }

    console.log("✅ 종목 & 리그 데이터 시드 완료");

};

// const seed = async () => {
//   const dataSource = await AppDataSource.initialize();

//   try {
//     for (const [sportName, leagues] of Object.entries(sportsData)) {
//       const sport = dataSource.manager.create(Sport, { name: sportName });
//       await dataSource.manager.save(sport);

//       for (const leagueName of leagues) {
//         const league = dataSource.manager.create(League, {
//           name: leagueName,
//           sport,
//         });
//         await dataSource.manager.save(league);
//       }
//     }

//     console.log("✅ 종목 & 리그 데이터 시드 완료");
//   } catch (error) {
//     console.error("❌ 시드 에러:", error);
//   } finally {
//     await dataSource.destroy();
//   }
// };

// seed();

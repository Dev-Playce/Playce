import { Like, Point, Repository } from "typeorm";
import { BigRegion } from "../entities/BigRegion";
import { SmallRegion } from "../entities/SmallRegion";
import { getCoordinatesByAddress } from "./kakaoAPI";
import { createError } from "./createError";

/**
 * 지역 이름 정규화
 * ex. '서울' -> '서울특별시'
 * @param name - 정규화할 지역 이름
 * @returns 정규화된 지역 이름
 */
export const normalizeRegionName = (name: string): string => {
  const map: Record<string, string> = {
    '서울': '서울특별시',
    '부산': '부산광역시',
    '대구': '대구광역시',
    '인천': '인천광역시',
    '광주': '광주광역시',
    '대전': '대전광역시',
    '울산': '울산광역시',
    '세종': '세종특별자치시',
    '경기': '경기도',
    '강원': '강원특별자치도',
    '충북': '충청북도',
    '충남': '충청남도',
    '전북': '전북특별자치도',
    '전남': '전라남도',
    '경북': '경상북도',
    '경남': '경상남도',
    '제주': '제주특별자치도',
  };

  return map[name] || name;
};

/**
 * 주소를 기반으로 위치(Point) 및 지역(Region) 엔티티 정보를 가지고 옮
 * @param address - 주소 문자열
 * @param bigRegionRepo  - BigRegion Repository
 * @param smallRegionRepo - SmallRegion Repository
 * @returns { lat: float, lng: float, bigRegion: BigRegion, smallRegion: SmallRegion }
 */
export const getLocationDataFromAddress = async (
  address: string,
  bigRegionRepo: Repository<BigRegion>,
  smallRegionRepo: Repository<SmallRegion>,
) => {
  // 카카오 API 호출 -> 좌표, 지역명 가져오기
  const { bigRegionName, smallRegionName, lat, lng } = await getCoordinatesByAddress(address);
  console.log(`- 좌표 : 위도(${lat}), 경도(${lng})`);

  // DB에서 지역 대/소분류 id 찾기
  const findBigRegion = await bigRegionRepo.findOne({
    where: { name: Like(`${normalizeRegionName(bigRegionName)}%`) },
  });
  if(!findBigRegion) throw createError('유효하지 않은 지역-대분류입니다.', 400);

  const findSmallRegion = await smallRegionRepo.findOne({
    where: {
      name: Like(`${smallRegionName}%`),
      bigRegion: findBigRegion
    }
  });
  if (!findSmallRegion) throw createError('유효하지 않은 지역-소분류입니다.', 400);
  console.log(`- 지역 id : 대분류(id: ${findBigRegion.id}, name: ${bigRegionName}), 소분류(id: ${findSmallRegion.id}, name: ${smallRegionName})`);

  // // Point 객체 생성
  // const location = {
  //   type: 'Point',
  //   coordinates: [lng, lat]
  // };
  // console.log('- Point 객체 : ', location);

  return { lat, lng, bigRegion: findBigRegion, smallRegion: findSmallRegion };
};
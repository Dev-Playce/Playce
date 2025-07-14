import { Equal, Repository } from "typeorm";
import { BigRegion } from "../entities/BigRegion";
import { SmallRegion } from "../entities/SmallRegion";
import { getCoordinatesByAddress } from "./kakaoAPI";
import { createError } from "./errorUtils";
import { log } from "./logUtils";

/**
 * 지역 이름 정규화
 * ex. '세종특별자치시' -> '세종'
 * @param name - 정규화할 지역 이름
 * @returns 정규화된 지역 이름
 */
export const normalizeRegionName = (name: string): string => {
  const map: Record<string, string> = {
    '세종특별자치시': '세종',
    '강원특별자치도': '강원',
    '전북특별자치도': '전북',
    '제주특별자치도': '제주',
  };

  return map[name] || name;
};

/**
 * 주소를 기반으로 위치(위도, 경도) 및 지역(Region) 엔티티 정보를 가지고 옮
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
  let bigRegionName: string;
  let smallRegionName: string;
  let lat: number;
  let lng: number;

  // .env 파일의 MOCK_GEOCODING 값이 true인 경우 mock 데이터 반환
  if (process.env.MOCK_GEOCODING === 'true') {
    bigRegionName = '서울';
    smallRegionName = '중구';
    lat = 37.5637;
    lng = 126.977;

    log('- 지역 데이터 : mock 데이터 사용');
  } else {
    // 카카오 API 호출 -> 좌표, 지역명 가져오기
    const result = await getCoordinatesByAddress(address);
    bigRegionName = result.bigRegionName;
    smallRegionName = result.smallRegionName;
    lat = result.lat;
    lng = result.lng;
    log('- 지역 데이터 : 카카오 API 호출');
  }

  log(`- 좌표 : 위도(${lat}), 경도(${lng})`);

  // DB에서 지역 대분류 id 찾기
  const searchBigRegionName = normalizeRegionName(bigRegionName);
  const findBigRegion = await bigRegionRepo.findOne({
    where: { name: Equal(searchBigRegionName) },
  });
  // if (!findBigRegion) throw createError('유효하지 않은 지역-대분류입니다.', 400);
  if (!findBigRegion){
    log('유효하지 않은 지역-대분류');
    throw createError('유효하지 않은 지역-대분류입니다.', 400);
  }

  // DB에서 지역 소분류 id 찾기
  let searchSmallRegionName = smallRegionName;
  if (smallRegionName.includes(' ') && smallRegionName.split(' ')[1]) {
    searchSmallRegionName = smallRegionName.split(' ')[0]; // 소분류 이름에서 공백 이후 부분 제거
  }
  const findSmallRegion = await smallRegionRepo.findOne({
    where: {
      name: Equal(searchSmallRegionName),
      bigRegion: findBigRegion
    }
  });
  // if (!findSmallRegion) throw createError('유효하지 않은 지역-소분류입니다.', 400);
  if (!findSmallRegion) {
    log('유효하지 않은 지역-소분류');
    throw createError('유효하지 않은 지역-소분류입니다.', 400);
  }

  log(`- 지역 id : 대분류(id: ${findBigRegion.id}, name: ${bigRegionName}), 소분류(id: ${findSmallRegion.id}, name: ${smallRegionName})`);

  return { lat, lng, bigRegion: findBigRegion, smallRegion: findSmallRegion };
};
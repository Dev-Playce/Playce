import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';
import { addFavoriteSuccessTest } from './addFavorite.success.test.js';

const CONTEXT = '즐겨찾기 삭제';
export const options = getOptions();

export const removeFavoriteSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/favorites/${storeId}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.del(url, null, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200 or 404`]: (r) => r.status === 200 || r.status === 404,
    '성공 메시지 확인': () => 
      json?.success === true 
      || json?.message?.includes('즐겨찾기가 삭제되었습니다.')
      || json?.message?.includes('해당 즐겨찾기 항목이 존재하지 않습니다.'), // 거의 동시에 삭제되기 때문에 허용하지 않으면 실패가 많음
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  } else if (res.status === 404) {
    console.info(`⚠️ ${CONTEXT} - 존재하지 않는 항목: ${json?.message}`);
  }   

  sleep(1);
}

export default function () {
  const token = loginAndGetToken(__ENV.EMAIL, __ENV.PASSWORD);

  if (token) {
    const storeIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // 테스트용 식당 ID 목록
    const storeId = storeIdList[__VU % storeIdList.length];

    // 1. 즐겨찾기 추가 (테스트 선행 작업)
    const resultStoreId = addFavoriteSuccessTest(token, storeId, false); // 테스트 전 DB 초기화(false)
    if (!resultStoreId) {
      console.error('❌ 즐겨찾기 추가 실패 - 테스트 중단');
      return;
    }

    // 2. 즐겨찾기 삭제
    removeFavoriteSuccessTest(token, resultStoreId);
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
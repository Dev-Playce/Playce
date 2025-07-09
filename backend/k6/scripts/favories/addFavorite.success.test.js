import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';

const CONTEXT = '즐겨찾기 추가';
export const options = getOptions();

export const addFavoriteSuccessTest = (token, storeId, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/favorites/${storeId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(url, null, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 201 or 409`]: (r) => r.status === 201 || r.status === 409,
    '성공 메시지 확인': () => 
      json?.success === true 
      || json?.message?.includes('즐겨찾기가 추가되었습니다.')
      || json?.message?.includes('이미 즐겨찾기에 추가된 식당입니다.'), // 거의 동시에 추가되기 때문에 허용하지 않으면 실패 많음
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  } else if (res.status === 409) {
    console.info(`⚠️ ${CONTEXT} - 중복 추가: ${json?.message}`);
  }

  // 테스트 후 DB 초기화 옵션이 true인 경우, 테스트 후 즐겨찾기 삭제
  if (cleanupAfterTest) {
    const delRes = http.del(`${BASE_URL}/favorites/${storeId}`, null, {
      headers: {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    });

    if (delRes.status !== 200 && delRes.status !== 404) {
      console.error(`❌ 즐겨찾기 삭제 실패`, {
        status: delRes.status,
        body: delRes.body,
      });
    }
  }

  sleep(1);
  return storeId;
}

export default function () {
  const token = loginAndGetToken(__ENV.EMAIL, __ENV.PASSWORD);

  if (token) {
    // const storeId = __ENV.STORE_ID || 1;
    const storeIdList = [1, 2, 3];
    const storeId = storeIdList[__VU % storeIdList.length];
    
    addFavoriteSuccessTest(token, storeId, true); // 테스트 전 DB 초기화(true)
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
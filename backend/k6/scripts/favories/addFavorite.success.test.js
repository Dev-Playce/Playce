import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '즐겨찾기 추가';
export const options = getOptions(409);

/**
 * 즐겨찾기 추가 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} storeId - 즐겨찾기에 추가할 식당 ID
 * @param {boolean} cleanupAfterTest - 테스트 후 삭제 여부 (기본값: false)
 * @returns {number} - 즐겨찾기에 추가한 식당 ID
 */
export const addFavoriteSuccessTest = (token, storeId, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/favorites/${storeId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  // 즐겨찾기 추가 요청
  const res = http.post(url, null, params);
  const json = parseJson(res, CONTEXT);

    const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 201 or 409`]: (r) => r.status === 201 || r.status === 409,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => 
      json?.success === true 
      || json?.message?.includes('즐겨찾기가 추가되었습니다.')
      || json?.message?.includes('이미 즐겨찾기에 추가된 식당입니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  } else if (res.status === 409) { // 409 에러 시 경고 로그 출력
    console.info(`⚠️ ${CONTEXT} - 중복 추가: ${json?.message}`);
  }

  // 테스트 후 삭제 옵션이 true인 경우, 즐겨찾기 삭제
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

  return storeId;
}

export function setup () {
  const token = getTokenOrFail();
  return { token };
}

export default function (data) {
  const storeIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // 테스트용 식당 ID 목록
  const storeId = storeIdList[(__VU - 1) % storeIdList.length];
  
  addFavoriteSuccessTest(data.token, storeId, true); // 테스트 후 즐겨찾기 삭제 (true)
}
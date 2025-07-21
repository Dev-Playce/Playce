import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

import { addFavoriteSuccessTest } from './addFavorite.success.test.js';

const CONTEXT = '즐겨찾기 삭제';
export const options = getOptions();

/**
 * 즐겨찾기 삭제 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} storeId - 삭제할 즐겨찾기 식당 ID
 */
export const removeFavoriteSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/favorites/${storeId}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 즐겨찾기 삭제 요청
  const res = http.del(url, null, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => 
      json?.success === true && json?.message?.includes('즐겨찾기가 삭제되었습니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  } else if (res.status === 404) {
    console.info(`⚠️ ${CONTEXT} - 존재하지 않는 항목: ${json?.message}`);
  }   
}

export function setup () {
  const token = getTokenOrFail();
  return { token };
}

export default function (data) {
  // 삭제 테스트를 위한 사전 등록 작업
  const storeIdList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // 테스트용 식당 ID 목록
  const storeId = storeIdList[__VU % storeIdList.length];

  const resultStoreId = addFavoriteSuccessTest(data.token, storeId, false); // 테스트 후 즐겨찾기 삭제 (false)
  if (!resultStoreId) {
    console.error('❌ 즐겨찾기 추가 실패 - 테스트 중단');
    return;
  }

  // 즐겨찾기 삭제
  removeFavoriteSuccessTest(data.token, resultStoreId);
}
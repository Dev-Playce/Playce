import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, STORE_ID } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '식당 상세 조회';
export const options = getOptions();

/**
 * 식당 상세 조회 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} storeId - 상세 조회할 식당 ID 
 */
export const getStoreDetailSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/stores/${storeId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  // 식당 상세 조회 요청
  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('식당 상세 조회 성공'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }
};

export function setup () {
  const token = getTokenOrFail();
  const storeId = STORE_ID || 1;
  
  return { token, storeId };
}

export default function (data) {
  getStoreDetailSuccessTest(data.token, data.storeId);
}
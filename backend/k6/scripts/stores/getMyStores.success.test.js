import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '내 식당 목록 조회';
export const options = getOptions();

/**
 * 내 식당 목록 조회 - 테스트 함수
 * @param {string} token - 인증 토큰 
 */
export const getMyStoresSuccessTest = (token) => {
  const url = `${BASE_URL}/stores/mypage`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  // 내 식당 목록 조회 요청
  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('내 식당 목록 조회 성공'),
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
  return { token };
}

export default function (data) {
  getMyStoresSuccessTest(data.token);
}
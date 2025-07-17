import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '내 식당 목록 조회';
export const options = getOptions();

export const getMyStoresSuccessTest = (token) => {
  const url = `${BASE_URL}/stores/mypage`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.get(url, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('내 식당 목록 조회 성공'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }

  // sleep(1);
};

export function setup () {
  const token = getTokenOrFail();
  return { token };
}

export default function (data) {
  getMyStoresSuccessTest(data.token);
}
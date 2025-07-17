import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '특정 식당의 중계 일정 목록 조회';
export const options = getOptions();

export const getBroadcastsByStoreSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/broadcasts/stores/${storeId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('중계 일정 조회 성공'),
  });

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
  const storeId = __ENV.STORE_ID || 1;
  return { token, storeId };
}

export default function (data) {
  getBroadcastsByStoreSuccessTest(data.token, data.storeId);
}
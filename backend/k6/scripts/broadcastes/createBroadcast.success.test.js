import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';
import { createBroadcast } from '../../utils/factories.js';

const CONTEXT = '중계 일정 등록';
export const options = getOptions();

export const createBroadcastSuccessTest = (token, newBroadcast, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/broadcasts`;
  const payload = newBroadcast;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.post(url, JSON.stringify(payload), params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 201`]: (r) => r.status === 201,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('중계 일정이 등록되었습니다.'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      broadcast: newBroadcast,
    });
  }

  const newBroadcastId = json?.data?.broadcast_id;
  // 테스트 후 DB 초기화 옵션이 true인 경우, 테스트 후 중계 일정 삭제
  if (cleanupAfterTest && newBroadcastId) {
    const delRes = http.del(`${BASE_URL}/broadcasts/${newBroadcastId}`, null, {
      headers: {
        ...DEFAULT_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (delRes.status !== 200) {
      console.error(`❌ 중계 일정 삭제 실패`, {
        status: delRes.status,
        body: delRes.body,
      });
    }
  }
  return newBroadcastId;
};

export function setup () {
  const token = getTokenOrFail();
  return { token };
}

export default function (data) {
  const newBroadcast = createBroadcast({ 
    vu: __VU,
    iter: __ITER,
  });

  createBroadcastSuccessTest(data.token, newBroadcast, true); // 테스트 후 DB 초기화(true)
}
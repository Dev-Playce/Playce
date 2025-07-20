import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

import { createBroadcast } from '../../utils/factories.js';
import { createBroadcastSuccessTest } from './createBroadcast.success.test.js';

const CONTEXT = '중계 일정 삭제';
export const options = getOptions();

/**
 * 중계 일정 삭제 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} broadcastId - 삭제할 중계 일정 ID 
 */
export const deleteBroadcastSuccessTest = (token, broadcastId) => {
  const url = `${BASE_URL}/broadcasts/${broadcastId}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 중계 일정 삭제 요청
  const res = http.del(url, null, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('중계 일정이 삭제되었습니다.'),
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
  // 삭제 테스트를 위한 사전 등록 작업
  const newBroadcast = createBroadcast({ vu: __VU, iter: __ITER }); // 중계 일정 mock 데이터 생성
  const broadcastId = createBroadcastSuccessTest(data.token, newBroadcast, false); // 테스트 후 중계 일정 삭제 (false)
  
  // 중계 일정 삭제
  if (broadcastId) {
    deleteBroadcastSuccessTest(data.token, broadcastId);
  }
}
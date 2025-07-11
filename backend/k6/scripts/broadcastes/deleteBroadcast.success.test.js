import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';
import { createBroadcast } from '../../utils/factories.js';
import { createBroadcastSuccessTest } from './createBroadcast.success.test.js';

const CONTEXT = '중계 일정 삭제';
export const options = getOptions();

export const deleteBroadcastSuccessTest = (token, broadcastId) => {
  const url = `${BASE_URL}/broadcasts/${broadcastId}`;
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.del(url, null, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('중계 일정이 삭제되었습니다.'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }

  sleep(1);
};

export default function () {
  const token = loginAndGetToken(__ENV.EMAIL, __ENV.PASSWORD);

  if (token) {
    // 1. 중계 일정 등록 (테스트 선행 작업)
    const newBroadcast = createBroadcast({ vu: __VU, iter: __ITER });
    const broadcastId = createBroadcastSuccessTest(token, newBroadcast, false); // 테스트 후 DB 초기화(false)
    
    // 2. 중계 일정 삭제
    if (broadcastId) {
      deleteBroadcastSuccessTest(token, broadcastId);
    }
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';

const CONTEXT = '중계 일정 수정';
export const options = getOptions();

export const updateBroadcastSuccessTest = (token, broadcastId, updateData) => {
  const url = `${BASE_URL}/broadcasts/${broadcastId}`;
  const payload = JSON.stringify(updateData);
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.patch(url, payload, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('중계 일정이 수정되었습니다.'),
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
    const broadcastId = __ENV.BROADCAST_ID || 1; 
    const updateData = {
      // match_date: '2025-07-09',
      // match_time: '16:30',
      // sport_id: 1,
      // league_id: 1,
      team_one: '팀 1',
      team_two: '팀 2',
      etc: '수정 테스트',
    };

    updateBroadcastSuccessTest(token, broadcastId, updateData);
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
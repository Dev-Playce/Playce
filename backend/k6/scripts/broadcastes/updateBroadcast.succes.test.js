import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '중계 일정 수정';
export const options = getOptions();

export const updateBroadcastSuccessTest = (token, broadcastId, updateData) => {
  const url = `${BASE_URL}/broadcasts/${broadcastId}`;
  const payload = updateData;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.patch(url, JSON.stringify(payload), params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('중계 일정이 수정되었습니다.'),
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

  const broadcastId = __ENV.BROADCAST_ID || 1;
  const updateData = {
    match_date: '2025-07-21',
    match_time: '09:00',
    team_one: '팀 1',
    team_two: '팀 2',
    etc: '수정 테스트',
  };

  return { token, broadcastId, updateData };
}

export default function (data) {
  updateBroadcastSuccessTest(data.token, data.broadcastId, data.updateData);
}
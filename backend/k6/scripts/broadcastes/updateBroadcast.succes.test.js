import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, BROADCAST_ID } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '중계 일정 수정';
export const options = getOptions();

/**
 * 중계 일정 수정 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} broadcastId - 수정할 중계 일정 ID
 * @param {object} updateData - 수정할 데이터 객체
 */
export const updateBroadcastSuccessTest = (token, broadcastId, updateData) => {
  const url = `${BASE_URL}/broadcasts/${broadcastId}`;
  const payload = updateData;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  // 중계 일정 수정 요청
  const res = http.patch(url, JSON.stringify(payload), params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('중계 일정이 수정되었습니다.'),
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

  const broadcastId = BROADCAST_ID || 1;
  const updateData = { // 수정할 중계 일정 mock 데이터 생성
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
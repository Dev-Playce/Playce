import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, SPORTS_ID } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '경기 리그 조회';
export const options = getOptions();

/**
 * 경기 리그 조회 - 테스트 함수
 * @param {number} sportsId - 스포츠 ID
 */
export const getLeaguesSuccessTest = (sportsId) => {
  const url = `${BASE_URL}/staticdata/leagues/${sportsId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  // 경기 리그 조회 요청
  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('리그 조회 성공'),
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
  const sportId = SPORTS_ID || 1;
  return { sportId };
}

export default function (data) {
  getLeaguesSuccessTest(data.sportId);
}
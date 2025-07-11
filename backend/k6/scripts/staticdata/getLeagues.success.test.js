import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '경기 리그 조회';
export const options = getOptions();

export const getLeaguesSuccessTest = (sportsId) => {
  const url = `${BASE_URL}/staticdata/leagues/${sportsId}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  const res = http.get(url, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('리그 조회 성공'),
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
  const sportId = __ENV.SPORTS_ID || 1;
  getLeaguesSuccessTest(sportId);
}
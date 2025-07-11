import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '통합 검색';
export const options = getOptions();

export const searchStoresSuccessTest = (query = {}) => {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = `${BASE_URL}/search?${queryString}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  const res = http.get(url, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('통합 검색 성공'),
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
  const query = {
    // search: '플레이스',
    // sport: 'soccer',
    // league: 'K League',
    big_region: '서울특별시',
    // small_region: '강남구',
  };
  searchStoresSuccessTest(query);
}
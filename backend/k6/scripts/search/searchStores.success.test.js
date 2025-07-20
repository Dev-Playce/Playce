import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '통합 검색';
export const options = getOptions();

/**
 * 통합 검색 - 테스트 함수
 * @param {object} query - 통합 검색 조건 객체 
 */
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

  // 통합 검색 요청
  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('통합 검색 성공'),
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
  const query = { // 통합 검색을 위한 검색 조건 생성
    // search: '플레이스',
    // sport: '축구',
    // league: 'K League',
    big_region: '서울특별시',
    small_region: '강남구',
  };
  return { query };
}

export default function (data) {
  searchStoresSuccessTest(data.query);
}
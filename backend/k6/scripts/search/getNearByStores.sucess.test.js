import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '현재 위치 기반 식당 검색';
export const options = getOptions();

export const getNearbyStoresSuccessTest = (lat, lng, radius) => {
  const url = `${BASE_URL}/search/nearby?lat=${lat}&lng=${lng}&radius=${radius}`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  const res = http.get(url, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('현재 위치 기반 검색 성공'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }

  // sleep(1);
};

export function setup () {
  const lat = __ENV.LAT || 37.5665; // 서울시청 위도
  const lng = __ENV.LNG || 126.978; // 서울시청 경도
  const radius = __ENV.RADIUS || 1000; // 기본 반경 1000m
  
  return { lat, lng, radius };
}

export default function (data) {
  getNearbyStoresSuccessTest(data.lat, data.lng, data.radius);
}
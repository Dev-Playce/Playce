// 테스트할 API의 기본 URL
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// 공통 요청 헤더
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// k6 테스트용 상수
export const EMAIL = 'hong@mail.com';
export const PASSWORD = '111111';

export const STORE_ID = 1;
export const BROADCAST_ID = 1;
export const BIG_REGION_ID = 1; // 서울
export const SPORTS_ID = 1; // 축구

export const LAT = 37.5665; // 서울시청 위도 
export const LNG = 126.978; // 서울시청 경도
export const RADIUS = 1000; // 기본 반경 1000m
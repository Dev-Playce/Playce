import http from 'k6/http';
import { BASE_URL } from '../config.js';
import { parseJson } from './common.js';

// =====================
// 공통 유틸 함수 (랜덤 숫자/문자열 생성, 사업자등록번호 조회 등)
// =====================

/**
 * 지정된 자릿수의 랜덤 숫자 문자열을 생성하는 함수
 * @param {number} length - 생성할 숫자의 자릿수 (기본값: 4)
 * @returns {string} - 지정된 자릿수의 랜덤 숫자 문자열
 */
const getRandomNumber = (length = 4) => {
  const max = 10 ** length;
  return String(Math.floor(Math.random() * max)).padStart(length,'0');
};

/**
 * 유니크한 ID를 생성하는 함수 (타임스탬프 + 랜덤문자열)
 * @param {number} length - 반환할 ID의 자릿수 (기본값: 16)
 * @returns {string} - 유니크한 문자열 ID
 */
const getUniqueId = (length = 16) => {
  const timestamp = Date.now(); // 예: 1720245908321
  const randomString = Math.random().toString(36).substring(2, 8); // 예: 'f3r2z9'
  const uniqueId = `${timestamp}${randomString}`; // 예: '1720245908321f3r2z9'

  return uniqueId.slice(0, length);
};

/**
 * 랜덤 비밀번호를 생성하는 함수
 * @param {number} length - 비밀번호 길이 (기본값: 6) 
 * @returns {string} - 랜덤 비밀번호
 */
const getRandomPassword = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/**
 * 사업자등록번호 목록을 조회하는 함수
 * @returns {string[]} - 사업자등록번호 목록
 */
export const getBusinessNumbers = () => {
  const url = `${BASE_URL}/staticdata/businessNumbers`;

  const res = http.get(url);
  const json = parseJson(res, '사업자등록번호 조회');

  if (res.status === 200 && json?.success && Array.isArray(json?.data)) {
    return json.data;
  }
  else {
    console.error('❌ 사업자등록번호 조회 실패');
    return [];
  }
};

// =====================
// Mock 데이터 생성 함수 (유저, 식당, 중계 일정)
// =====================

/**
 * 유저 mock 데이터를 생성하는 함수
 * @param {Object} overrides - 기본값을 덮어쓸 객체 
 * @param {boolean} isPasswordRandom - 비밀번호를 랜덤으로 생성할지 여부 (기본값: false -> '000000'으로 비밀번호 설정)
 * @returns {object} - 유저 데이터 객체
 */
export const createUser = (overrides = {}, isPasswordRandom = false) => {
  const uniqueId = getUniqueId(16);
  const password = isPasswordRandom
    ? getRandomPassword(6)
    : '000000';
  
  return {
    email: `user${uniqueId}@mail.com`,
    password,
    name: 'user',
    nickname: `userNick-${uniqueId.slice(-8)}`,
    phone: `010-${getRandomNumber(4)}-${getRandomNumber(4)}`,
    ...overrides
  };
};

/**
 * 식당 mock 데이터를 생성하는 함수
 * k6의 __VU__와 __ITER__ 환경 변수를 사용하여 가상 유저 수와 반복 횟수에 따라 데이터가 달라짐
 * @param {object} options - 데이터 생성 옵션
 * @param {number} [options.vu=1] - 현재 가상 유저 번호 (기본값: 1)
 * @param {number} [options.iter=0] - 현재 반복 횟수 (기본값: 0)
 * @param {object} [overrides={}] - 기본값을 덮어쓸 객체
 * @returns {object} - 식당 데이터 객체
 */
export const createStore = ({ vu = 1, iter = 0, loadBusinessNumbers, overrides = {} } = {}) => {
  const uniqueSuffix = `${vu}-${iter}`;

  const filteredBusinessNumbers = loadBusinessNumbers.filter(bn => bn.id > 16);
  const businessNumberIndex = ((vu - 1) * 1000 + iter) % filteredBusinessNumbers.length;
  const selectedBusinessNumberObject = filteredBusinessNumbers[businessNumberIndex];
  const selectedBusinessNumber = selectedBusinessNumberObject.businessNumber;

  return {
    store_name: `k6 테스트 store-${uniqueSuffix}`,
    business_number: selectedBusinessNumber,
    address: '서울 중구 세종대로 80 지하1층',
    phone: `010-${getRandomNumber(4)}-${getRandomNumber(4)}`,
    opening_hours: '영업시간',
    menus: [
      { name: '메뉴_1', price: '1000' },
      { name: '메뉴_2', price: '2000' },
    ],
    type: '업종',
    description: '설명',
    ...overrides
  };
};

/**
 * 중계 일정 mock 데이터를 생성하는 함수
 * @param {object} options - 데이터 생성 옵션
 * @param {number} [options.vu=1] - 현재 가상 유저 번호 (기본값: 1)
 * @param {number} [options.iter=0] - 현재 반복 횟수 (기본값: 0)
 * @param {object} [overrides={}] - 기본값 덮어쓰기 객체
 * @returns {object} - 중계 일정 데이터 객체
 */
export const createBroadcast = ({ vu = 1, iter = 0, overrides = {} } = {}) => {
  const uniqueSuffix = `${vu}-${iter}`;
  
  const today = new Date();
  const match_date = today.toISOString().slice(0, 10); // 현재 날짜 : YYYY-MM-DD 형식
  const match_time = today.toTimeString().slice(0, 5); // 현재 시간 : HH:MM 형식

  return {
    store_id: overrides.store_id || 1,
    match_date,
    match_time,
    sport_id: overrides.sport_id || 1,
    league_id: overrides.league_id || 1,
    team_one: `팀1-${uniqueSuffix}`,
    team_two: `팀2-${uniqueSuffix}`,
    etc: overrides.etc || '기타 정보',
    ...overrides,
  };
};
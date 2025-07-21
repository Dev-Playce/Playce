import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS, EMAIL, PASSWORD } from '../config.js';
import { parseJson } from './common.js';

/**
 * 로그인 요청 후 인증 토큰 반환
 * @param {string} email - 사용자 이메일 
 * @param {string} password - 사용자 비밀번호 
 * @returns {string} - 인증 토큰 (로그인 실패 시 빈 문자열)
 */
const loginAndGetToken = (email, password) => {
  const loginEmail = email || EMAIL || 'hong@mail.com';
  const loginPassword = password || PASSWORD || '111111';

  const url = `${BASE_URL}/users/login`;
  const payload = JSON.stringify({ email: loginEmail, password: loginPassword });
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  let token = null;

  try {
    const res = http.post(url, payload, params); // 로그인 요청
    const json = parseJson(res, 'auth');

    const success = check(res, {
      '[인증] 로그인 성공': (r) => r.status === 200,
      '[인증] 토큰 확인': () => json?.data?.token && typeof json.data.token === 'string',
    });

    // 로그인 성공 여부 확인
    if (!success) {
      console.error('❌ 로그인 실패', {
        status: res.status,
        body: res.body,
      });
      return null;
    }
    
    // 토큰 확인
    token = json?.data?.token;
    if (!token) {
      console.error('❌ 로그인 실패 - 토큰이 없습니다.', {
        status: res.status,
        body: res.body,
      });
      return null;
    }
  } catch (error) {
    console.error('❌ 로그인 요청 중 에러 발생', {
      error: error.message,
    });
    return null;
  }

  return token;
}

/**
 * 로그인 후 인증 토큰을 반환하며, 실패 시 예외 발생
 * @returns {string} - 인증 토큰 (로그인 실패 시 예외 발생)
 */
export const getTokenOrFail = () => {
  const token = loginAndGetToken();
  
  if (!token) {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
    throw new Error('토큰 발급 실패');
  }

  return token;
};
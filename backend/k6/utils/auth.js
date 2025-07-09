import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../config.js';
import { parseJson } from './common.js';

/**
 * 로그인 요청 후 JWT 토큰 반환
 * @param {string} email - 사용자 이메일 
 * @param {string} password - 사용자 비밀번호 
 * @returns {string} - JWT 토큰 (로그인 실패 시 빈 문자열)
 */
export const loginAndGetToken = (email, password) => {
  const loginEmail = email || 'hong@mail.com';
  const loginPassword = password || '111111';

  const url = `${BASE_URL}/users/login`;
  const payload = JSON.stringify({ email: loginEmail, password: loginPassword });
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
    },
  };

  let token = null;

  try {
    const res = http.post(url, payload, params); // 요청 보내기
    const json = parseJson(res, 'auth');

    const success = check(res, {
      '(auth) 로그인 성공': (r) => r.status === 200,
      '(auth) 토큰 확인': () => json?.data?.token && typeof json.data.token === 'string',
    });

    if (!success) {
      console.error('❌ 로그인 실패', {
        status: res.status,
        body: res.body,
      });
      return null;
    }
    
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
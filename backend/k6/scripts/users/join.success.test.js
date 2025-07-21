import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

import { createUser } from '../../utils/factories.js';

const CONTEXT = '회원가입';
export const options = getOptions();

/**
 * 회원가입 - 테스트
 * @param {object} newUser - 회원가입할 유저 데이터 객체
 * @param {boolean} cleanupAfterTest - 테스트 후 삭제 여부 (기본값: false)
 * @returns {number} 회원가입된 유저 ID
 */
export const joinSuccessTest = (newUser, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/users/join`;
  const payload = newUser;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    }
  };

  // 회원가입 요청
  const res = http.post(url, JSON.stringify(payload), params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 201`]: (r) => r.status === 201,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('회원가입이 완료되었습니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      user: newUser,
    });
  }

  // 현재 유저 삭제 API가 없으므로, 테스트 후 시드 명령어로 DB 초기화 필요
  const newUserId = json?.data?.id;
  if (cleanupAfterTest && newUserId) {
    // TODO : 유저 삭제 API 필요
  }

  return newUserId;
}

export default function () {
  const newUser = createUser({}, true); // 유저 mock 데이터 생성 : 랜덤 비밀번호 생성 (true)
  joinSuccessTest(newUser, true); // 테스트 후 유저 삭제 (true)
}
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { createUser } from '../../utils/factories.js';

const CONTEXT = '회원가입';
export const options = getOptions();

export const joinSuccessTest = (newUser, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/users/join`;
  const payload = newUser;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    }
  };

  const res = http.post(url, JSON.stringify(payload), params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 201`]: (r) => r.status === 201,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('회원가입이 완료되었습니다.'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      user: newUser,
    });
  }

  // TODO : 유저 삭제 API 필요
  const newUserId = json?.data?.id;
  if (cleanupAfterTest && newUserId) {

  }

  // sleep(1);
  return success ? newUserId : null;
}

export default function () {
  const newUser = createUser({}, true); // 유저 mock 데이터 생성 : 랜덤 비밀번호 생성(true)
  joinSuccessTest(newUser, true); // 테스트 후 DB 초기화(true)
}
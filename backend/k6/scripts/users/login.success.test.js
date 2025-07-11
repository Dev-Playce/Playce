import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '로그인';
export const options = getOptions();

export const loginSuccessTest =  (loginUser) => {
  const url = `${BASE_URL}/users/login`;
  const payload = JSON.stringify(loginUser);
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    }
  };

  const res = http.post(url, payload, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('로그인이 완료되었습니다.'),
    '토큰 확인': () => json?.data?.token && typeof json.data.token === 'string',
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      user: loginUser,
    });
  }

  sleep(1);
  return json?.data?.token || null;
};

export default function () {
  const loginUser = {
    email: __ENV.EMAIL || 'hong@mail.com',
    password: __ENV.PASSWORD || '111111'
  };

  loginSuccessTest(loginUser);
}
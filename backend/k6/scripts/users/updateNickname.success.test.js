import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';
import { createUser } from '../../utils/factories.js';

const CONTEXT = '닉네임 변경';
export const options = getOptions();

export const updateNicknameSuccessTest = (token, newNickname) => {
  const url = `${BASE_URL}/users/nickname`;
  const payload = { nickname: newNickname };
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.patch(url, JSON.stringify(payload), params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('닉네임이 변경되었습니다.'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      nickname: newNickname,
    });
  }

  // sleep(1);
};

export function setup () {
  const token = getTokenOrFail();
  const newNickname = createUser().nickname;
  return { token, newNickname };
}

export default function (data) {
  updateNicknameSuccessTest(data.token, data.newNickname);
}
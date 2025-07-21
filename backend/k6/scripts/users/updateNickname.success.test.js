import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';
import { createUser } from '../../utils/factories.js';

const CONTEXT = '닉네임 변경';
export const options = getOptions();

/**
 * 닉네임 변경 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {string} newNickname - 수정할 유저 닉네임 
 */
export const updateNicknameSuccessTest = (token, newNickname) => {
  const url = `${BASE_URL}/users/nickname`;
  const payload = { nickname: newNickname };
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  };

  // 닉네임 변경 요청
  const res = http.patch(url, JSON.stringify(payload), params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('닉네임이 변경되었습니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      nickname: newNickname,
    });
  }
};

export function setup () {
  const token = getTokenOrFail();
  const newNickname = createUser().nickname; // 수정할 유저 닉네임 mock 데이터 생성
  return { token, newNickname };
}

export default function (data) {
  updateNicknameSuccessTest(data.token, data.newNickname);
}
import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';
import { createStore, getBusinessNumbers } from '../../utils/factories.js';
import { createStoreSuccessTest } from './createStore.success.test.js';

const CONTEXT = '식당 삭제';
export const options = getOptions();

export const deleteStoreSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/stores/${storeId}`;
  const params = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.del(url, null, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('식당이 삭제되었습니다.'),
  });

  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }

  sleep(1);
};

export function setup () {
  const businessNumbers = getBusinessNumbers();
  return { businessNumbers };
}

export default function (data) {
  const token = loginAndGetToken(__ENV.EMAIL, __ENV.PASSWORD);

  if (token) {
    // 1. 식당 등록 (테스트 선행 작업)
    const newStore = createStore({
      vu: __VU,
      iter: __ITER,
      loadBusinessNumbers: data.businessNumbers,
    });
    const storeId = createStoreSuccessTest(token, newStore, false); // 테스트 후 DB 초기화 : false

    // 2. 식당 삭제
    if (storeId) {
      deleteStoreSuccessTest(token, storeId);
    }
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
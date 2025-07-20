import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

import { createStore, getBusinessNumbers } from '../../utils/factories.js';
import { createStoreSuccessTest } from './createStore.success.test.js';

const CONTEXT = '식당 삭제';
export const options = getOptions();

/**
 * 식당 삭제 - 테스트 함수
 * @param {string} token - 인증 토큰 
 * @param {number} storeId - 삭제할 식당 ID
 */
export const deleteStoreSuccessTest = (token, storeId) => {
  const url = `${BASE_URL}/stores/${storeId}`;
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // 식당 삭제 요청
  const res = http.del(url, null, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('식당이 삭제되었습니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
    });
  }
};

export function setup () {
  const token = getTokenOrFail();
  const businessNumbers = getBusinessNumbers();
  return { token, businessNumbers };
}

export default function (data) {
  // 삭제 테스트를 위한 사전 등록 작업
  const newStore = createStore({
    vu: __VU,
    iter: __ITER,
    loadBusinessNumbers: data.businessNumbers,
  });
  const storeId = createStoreSuccessTest(data.token, newStore, false); // 테스트 후 식당 삭제 (false)

  // 식당 삭제
  if (storeId) {
    deleteStoreSuccessTest(data.token, storeId);
  }
}
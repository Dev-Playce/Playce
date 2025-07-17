import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../../config.js';
import { encodeMultipart, getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

import { getBusinessNumbers, createStore } from '../../utils/factories.js';

const CONTEXT = '식당 등록';
export const options = getOptions();

/**
 * 식당 등록 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {object} newStore - 등록할 식당 데이터
 * @param {boolean} cleanupAfterTest - 테스트 후 삭제 여부 (기본값: false)
 * @returns {number} 등록된 식당 ID
 */
export const createStoreSuccessTest = (token, newStore, cleanupAfterTest = false) => {
  const url = `${BASE_URL}/stores`;

  const data = {
    store_name: newStore.store_name,
    business_number: newStore.business_number,
    address: newStore.address,
    phone: newStore.phone,
    opening_hours: newStore.opening_hours,
    menus: JSON.stringify(newStore.menus), // 메뉴는 JSON 문자열로 변환
    type: newStore.type,
    ...(newStore.description && { description: newStore.description }),
  };

  const { payload, boundary } = encodeMultipart(data);

  const params = {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${token}`,
    },
  };

  // 식당 등록 요청
  const res = http.post(url, payload, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 201`]: (r) => r.status === 201,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => 
      json?.success === true && json?.message?.includes('식당이 등록되었습니다.'),
  });

  // 요청 실패 시 에러 로그 출력
  if (!success) {
    console.error(`❌ ${CONTEXT} - 실패`, {
      status: res.status,
      body: res.body,
      message: json?.message,
      store: newStore,
    });
  } else if (res.status === 409) { // 409 에러 시 경고 로그 출력
    console.info(`⚠️ ${CONTEXT} - 중복 추가: ${json?.message}`);
  }
  
    // 테스트 후 삭제 옵션이 true인 경우, 식당 삭제
    const newStoreId = json?.data?.id;
    if (cleanupAfterTest && newStoreId) {
      const delRes = http.del(`${BASE_URL}/stores/${newStoreId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    
      if (delRes.status !== 200) {
        console.error(`❌ 식당 삭제 실패`, {
          status: delRes.status,
          body: delRes.body
        });
      }
    }
  
    return newStoreId;
};

export function setup () {
  const token = getTokenOrFail();
  const businessNumbers = getBusinessNumbers();

  return { token, businessNumbers };
}

export default function (data) {
  const newStore = createStore({ // 식당 mock 데이터 생성
    vu: __VU,
    iter: __ITER,
    loadBusinessNumbers: data.businessNumbers,
  });

  createStoreSuccessTest(data.token, newStore, true); // 테스트 후 식당 삭제 (true)
}
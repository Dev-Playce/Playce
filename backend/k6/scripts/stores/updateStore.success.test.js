import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, STORE_ID } from '../../config.js';
import { encodeMultipart, getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';

const CONTEXT = '식당 수정';
export const options = getOptions();

/**
 * 식당 수정 - 테스트 함수
 * @param {string} token - 인증 토큰
 * @param {number} storeId - 수정할 식당 ID
 * @param {object} updateData - 수정할 데이터 객체
 */
export const updateStoreSuccessTest = (token, storeId, updateData) => {
  const url = `${BASE_URL}/stores/${storeId}`;

  const data = {
    ...(updateData.store_name && { store_name: updateData.store_name }),
    ...(updateData.address && { address: updateData.address }),
    ...(updateData.phone && { phone: updateData.phone }),
    ...(updateData.opening_hours && { opening_hours: updateData.opening_hours }),
    ...(updateData.menus && { menus: JSON.stringify(updateData.menus) }), // 메뉴는 JSON 문자열로 변환
    ...(updateData.type && { type: updateData.type }),
    ...(updateData.description && { description: updateData.description }),
  };

  const { payload, boundary } = encodeMultipart(data);

  const params = {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${token}`,
    },
  };

  // 식당 수정 요청
  const res = http.patch(url, payload, params); 
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('식당이 수정되었습니다.'),
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
  const storeId = STORE_ID || 1;
  return { token, storeId };
}

export default function (data) {
  const updateData = { // 수정할 식당 mock 데이터 생성
    store_name: `수정된 식당 이름 ${new Date().toISOString()}`,
    // address: '',
    phone: '010-1234-5678',
    opening_hours: '10:00-22:00',
    menus: [
      { name: '수정된 메뉴1', price: '15000' },
      { name: '수정된 메뉴2', price: '20000' },
    ],
    type: '수정',
    description: '수정된 식당 설명',
  };

  updateStoreSuccessTest(data.token, data.storeId, updateData);
}
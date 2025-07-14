import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';
import { loginAndGetToken } from '../../utils/auth.js';

const CONTEXT = '식당 수정';
export const options = getOptions();

export const updateStoreSuccessTest = (token, storeId, updateData) => {
  const url = `${BASE_URL}/stores/${storeId}`;

  const payload = {
    ...(updateData.store_name && { store_name: updateData.store_name }),
    ...(updateData.address && { address: updateData.address }),
    ...(updateData.phone && { phone: updateData.phone }),
    ...(updateData.opening_hours && { opening_hours: updateData.opening_hours }),
    ...(updateData.menus && { menus: JSON.stringify(updateData.menus) }), // 메뉴는 JSON 문자열로 변환
    ...(updateData.type && { type: updateData.type }),
    ...(updateData.description && { description: updateData.description }),
  };

  const params = {
    headers: {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  };

  const res = http.patch(url, JSON.stringify(payload), params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`${CONTEXT} - 성공 : status is 200`]: (r) => r.status === 200,
    '성공 메시지 확인': () => json?.success === true && json?.message?.includes('식당이 수정되었습니다.'),
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

export default function () {
  const token = loginAndGetToken(__ENV.EMAIL, __ENV.PASSWORD);

  if (token) {
    const storeId = __ENV.STORE_ID || 1; 
    const updateData = {
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

    updateStoreSuccessTest(token, storeId, updateData);
  } else {
    console.error('❌ 토큰 발급 실패 - 사용자 인증 불가');
  }
}
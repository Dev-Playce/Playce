import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { encodeMultipart, getOptions, parseJson } from '../../utils/common.js';
import { getTokenOrFail } from '../../utils/auth.js';
import { getBusinessNumbers, createStore } from '../../utils/factories.js';

const CONTEXT = '식당 등록';
export const options = getOptions(409);

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
    // timeout: 60000
  };

  const res = http.post(url, payload, params); // 요청 보내기
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    // [`[${CONTEXT}] 성공 : status is 201`]: (r) => r.status === 201,
    [`[${CONTEXT}] 성공 : status is 201 or 409`]: (r) => r.status === 201 || r.status === 409,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => 
      // json?.success === true && json?.message?.includes('식당이 등록되었습니다.'),
      json?.success === true
        || json?.message?.includes('식당이 등록되었습니다.') 
        || json?.message?.includes('이미 등록된 사업자등록번호입니다.'),
  });

    if (!success) {
      console.error(`❌ ${CONTEXT} - 실패`, {
        status: res.status,
        body: res.body,
        message: json?.message,
        store: newStore,
      });
    } else if (res.status === 409) {
      console.info(`⚠️ ${CONTEXT} - 중복 추가: ${json?.message}`);
    }
  
    // 테스트 후 DB 초기화 옵션이 true인 경우, 테스트 후 식당 삭제
    const newStoreId = json?.data?.id;
    if (cleanupAfterTest && newStoreId) {
      const delRes = http.del(`${BASE_URL}/stores/${newStoreId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    
      if (delRes.status !== 200) {
        console.error(`❌ 식당 삭제 실패`, {
          status: delRes.status,
          body: delRes.body
        });
      }
    }
  
    // sleep(1);
    return newStoreId;
};

export function setup () {
  const token = getTokenOrFail();
  const businessNumbers = getBusinessNumbers();
  return { token, businessNumbers };
}

export default function (data) {
  const newStore = createStore({
    vu: __VU,
    iter: __ITER,
    loadBusinessNumbers: data.businessNumbers,
  });

  createStoreSuccessTest(data.token, newStore, true); // 테스트 후 DB 초기화 : true
}
import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../../config.js';
import { getOptions, parseJson } from '../../utils/common.js';

const CONTEXT = '지역 대분류 조회';
export const options = getOptions();

/**
 * 지역 대분류 조회 - 테스트 함수
 */
export const getBigRegionsSuccessTest = () => {
  const url = `${BASE_URL}/staticdata/bigRegions`;
  const params = {
    headers: {
      ...DEFAULT_HEADERS,
    },
  };

  // 지역 대분류 조회 요청
  const res = http.get(url, params);
  const json = parseJson(res, CONTEXT);

  const success = check(res, {
    [`[${CONTEXT}] 성공 : status is 200`]: (r) => r.status === 200,
    [`[${CONTEXT}] 성공 메시지 확인`]: () => json?.success === true && json?.message?.includes('지역 대분류 조회 성공'),
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

export default function () {
  getBigRegionsSuccessTest();
}
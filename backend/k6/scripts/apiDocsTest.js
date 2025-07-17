import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../config.js';
import { getOptions, checkStatus } from '../utils/common.js';

export const options = getOptions();

export default function () {
  const url = `${BASE_URL}/api-docs/`;
  const res = http.get(url, { headers: DEFAULT_HEADERS });

  checkStatus(res, undefined, 'Swagger 문서 응답 확인'); // status code가 200이 아니더라도 응답이 있는지 확인
  // sleep(1);
}


/**
 * k6 부하 테스트 옵션 설정
 * @param {number | number[]} allowStatusCode - 성공으로 처리할 status code (기본값: undefined)
 * @returns {Object} - k6 부하 테스트 옵션
 */
export const getOptions = (allowStatusCode = undefined) => {
  const selectIndex = 0;
  const vusOption = [2, 100, 500, 1000];
  const durationOption = ['20s', '1m', '2m', '5m'];

  let options;

  if (selectIndex === 4) { // 4 : 점진적 증가 부하 테스트
    options = {
      stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 500 },
        { duration: '5m', target: 1000 },
        { duration: '2m', target: 0 },
      ],
    };
  } else { // 0, 1, 2, 3 : 고정 부하 테스트
    options = {
      vus: vusOption[selectIndex],           // 가상 사용자 수
      duration: durationOption[selectIndex], // 테스트 시간
    };
  }

  options.thresholds = {              // 성능 기준 설정 -> 자동 pass/fail 판정 가능
    http_req_failed: ['rate<0.01'],   // 실패율 1% 미만
    http_req_duration: ['p(95)<500'], // 95% 요청 응답시간이 500ms 이하
  };

  // 200, 201 외에 성공으로 처리할 status code가 있다면 설정
  if (allowStatusCode) {
    options.ext = {
      loadimpact: {
        expected_response: {
          status: [allowStatusCode],
        },
      },
    };
  }

  return options;
}

/**
 * JSON 파싱 및 에러 처리
 * @param {Object} res - k6 HTTP response 객체 
 * @param {string} context - 로그에 찍힐 문구 (ex. 로그인, 회원가입) 
 * @returns {Object || null} - 파싱된 JSON 객체, 실패 시 null 반환 
 */
export const parseJson = (res, context = '') => {
  try {
    return JSON.parse(res.body);
  } catch (error) {
    console.error(`❌ ${context} - JSON 파싱 실패`, {
      error: error.message,
      body: res.body,
    });

    return null;
  }
};

/**
 * 객체 데이터를 multipart/form-data 형식으로 인코딩하는 함수
 * @param {object} data - multipart로 인코딩할 객체
 * @param {string} [boundary] - 사용할 boundary 문자열 (기본값은 webkit 형식)
 * @returns {{ payload: string, boundary: string }} - 인코딩된 payload와 boundary 문자열
 */
export const encodeMultipart = (data, boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW') => {
  const lines = [];

  for (const key in data) {
    const value = data[key];

    if (Array.isArray(value)) {
      value.forEach((item) => {
        lines.push(`--${boundary}`);
        lines.push(`Content-Disposition: form-data; name="${key}[]"`);
        lines.push('');
        lines.push(item);
      });
    } else {
      lines.push(`--${boundary}`);
      lines.push(`Content-Disposition: form-data; name="${key}"`);
      lines.push('');
      lines.push(value);
    }
  }

  lines.push(`--${boundary}--`);
  lines.push('');

  const payload = lines.join('\r\n');
  
  return {
    payload,
    boundary,
  };
};
/**
 * k6 부하 테스트 옵션 설정
 * @returns {Object} - k6 부하 테스트 옵션
 */
export const getOptions = () => {
  return {
    vus: 10,         // 가상 사용자 수
    duration: '30s', // 테스트 시간
    thresholds: {    // 성능 기준 설정 -> 자동 pass/fail 판정 가능
      http_req_failed: ['rate<0.01'], // 실패율 1% 미만
      http_req_duration: ['p(95)<500'],  // 95% 요청 응답시간이 500ms 이하
    },
  }

  // [ 테스트 옵션 ]
  // 기본 부하 테스트 - vus: 10, duration : '30s' (소규모 트래픽 시나리오, 빠른 결과 확인)
  // 중간 부하 테스트 - vus: 50,  duration : '1m' (어느 정도 트래픽이 있는 상황을 시뮬레이션, 성능 병목 확인용)
  // 고부하 테스트    - vus: 200, duration : '5m' (서버 최대 처리 능력 확인, 시스템 안정성 점검)

  // 점진적 증가 : 실제 트래픽 변화처럼 점진적으로 부하 조절 가능, 시스템의 동적 반응 확인에 유용
  // return {
  //   stages : [
  //     { duration: '1m', target: 10 }, // 0~1분(1분간) : 10명까지 점진 증가
  //     { duration: '2m', target: 50 }, // 1~3분(2분간) : 50명까지 유지/증가
  //     { duration: '3m', target: 0 },  // 3~6분(3분간) : 사용자 0명으로 감소
  //   ],
  //   thresholds: {
  //     http_req_duration: ['p(95)<500'],
  //   },
  // }
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
export const createError = (message: string, status: number): Error => {
    const error = new Error(message);
    (error as any).status = status;
    return error;
  };

export const logApiError = (apiName: string, error: any) => {
  console.error(`❌ ${apiName} - 실패 : `);
  console.error(`- 메시지 : ${error.message}`);

  if (error.stack) console.error(`- 스택 : ${error.stack}`);

  console.error(`- 전체 에러 객체 : ${error}`);
};
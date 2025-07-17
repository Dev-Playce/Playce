export const log = (...args: any[]) => {
  const LOG_ENABLED = process.env.LOG_ENABLED !== "false";
  
  if (LOG_ENABLED) {
    console.log(...args);
  }
};


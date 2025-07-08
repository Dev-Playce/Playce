const LOG_ENABLED = process.env.LOG_ENABLED !== "false";

export const log = (...args: any[]) => {
  if (LOG_ENABLED) {
    console.log(...args);
  }
};


export const success = (res: any, message: string, data?: any, status: number = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };
  
  export const fail = (res: any, message: string, status: number = 400) => {
    return res.status(status).json({
      success: false,
      message,
    });
  };
  
export function handleResponse<T>(success: boolean, message: string, data?: T) {
  if (success && data === undefined) {
    return {
      success: true,
      message,
    };
  } else if (success && data !== undefined) {
    return {
      success: true,
      message,
      data,
    };
  } else {
    return {
      success: false,
      message,
    };
  }
}

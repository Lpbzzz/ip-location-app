/**
 * IP地址相关工具函数
 */

/**
 * IP地址格式验证函数
 * @param ip IP地址字符串
 * @returns 是否为有效的IPv4地址
 */
export const validateIpAddress = (ip: string): boolean => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

/**
 * 将IP段数组转换为IP字符串
 * @param segments IP段数组
 * @returns IP字符串
 */
export const segmentsToIp = (segments: string[]): string => {
  return segments.join('.');
};

/**
 * 将IP字符串转换为IP段数组
 * @param ip IP字符串
 * @returns IP段数组
 */
export const ipToSegments = (ip: string): string[] => {
  const segments = ip.split('.');
  return segments.length === 4 ? segments : ['', '', '', ''];
};

/**
 * 处理IP段输入值
 * @param value 输入值
 * @returns 处理后的值
 */
export const processIpSegmentValue = (value: string): string => {
  // 只允许数字输入
  const numericValue = value.replace(/[^0-9]/g, '');
  
  // 限制每段最大值为255
  return numericValue ? Math.min(parseInt(numericValue), 255).toString() : '';
};

/**
 * 检查是否应该自动跳转到下一个输入框
 * @param value 当前输入值
 * @param processedValue 处理后的值
 * @returns 是否应该跳转
 */
export const shouldJumpToNext = (value: string, processedValue: string): boolean => {
  return value.includes('.') || processedValue.length === 3;
};
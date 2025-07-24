/**
 * IP地址处理工具函数
 */

/**
 * 处理IP段输入值，确保只包含数字且不超过255
 * @param value 输入的值
 * @returns 处理后的值
 */
export const processIpSegmentValue = (value: string): string => {
  // 只保留数字
  const numericValue = value.replace(/[^0-9]/g, '');
  
  // 转换为数字进行范围检查
  const num = parseInt(numericValue, 10);
  
  // 如果为空或NaN，返回空字符串
  if (isNaN(num)) {
    return '';
  }
  
  // 确保不超过255
  if (num > 255) {
    return '255';
  }
  
  return numericValue;
};

/**
 * 判断是否应该跳转到下一个输入框
 * @param originalValue 原始输入值
 * @param processedValue 处理后的值
 * @returns 是否应该跳转
 */
export const shouldJumpToNext = (originalValue: string, processedValue: string): boolean => {
  // 如果输入了点号
  if (originalValue.includes('.')) {
    return true;
  }
  
  // 如果当前段已经是3位数
  if (processedValue.length === 3) {
    return true;
  }
  
  // 如果输入的是100-255之间的数字且已经输入完整
  const num = parseInt(processedValue, 10);
  if (num >= 100 && processedValue.length >= 3) {
    return true;
  }
  
  return false;
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
  // 确保返回4个段，不足的用空字符串填充
  while (segments.length < 4) {
    segments.push('');
  }
  return segments.slice(0, 4);
};

/**
 * 验证IP地址格式是否正确
 * @param ip IP字符串
 * @returns 是否为有效IP
 */
export const isValidIp = (ip: string): boolean => {
  const segments = ip.split('.');
  
  if (segments.length !== 4) {
    return false;
  }
  
  return segments.every(segment => {
    const num = parseInt(segment, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && segment === num.toString();
  });
};

/**
 * 格式化IP地址显示
 * @param ip IP字符串
 * @returns 格式化后的IP字符串
 */
export const formatIp = (ip: string): string => {
  if (!isValidIp(ip)) {
    return ip;
  }
  
  return ip.split('.').map(segment => {
    const num = parseInt(segment, 10);
    return num.toString();
  }).join('.');
};
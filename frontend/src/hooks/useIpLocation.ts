import { useState } from 'react';
import { message } from 'antd';
import type { LocationData } from '../utils/apiService';
import { IpLocationService } from '../utils/apiService';
import { validateIpAddress, ipToSegments } from '../utils/ipUtils';

/**
 * IP地理位置查询Hook
 */
export const useIpLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIpLoading, setCurrentIpLoading] = useState(false);
  const [ipSegments, setIpSegments] = useState(['', '', '', '']);

  /**
   * 搜索IP地理位置
   * @param ip IP地址
   */
  const searchIpLocation = async (ip: string) => {
    // 1. 首先trim前后空格
    const trimmedIp = ip.trim();
    
    if (!trimmedIp) {
      message.error('请输入IP地址');
      return;
    }

    // 2. 检测IP格式问题，不对的话进行报错
    if (!validateIpAddress(trimmedIp)) {
      message.error('IP地址格式不正确，请输入有效的IPv4地址（例如：8.8.8.8）');
      return;
    }

    setLoading(true);
    try {
      const data = await IpLocationService.queryIpLocation(trimmedIp);
      setLocationData(data);
      message.success('IP地理位置查询成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '查询失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取当前IP位置
   */
  const getCurrentLocation = async () => {
    setCurrentIpLoading(true);
    try {
      const data = await IpLocationService.getCurrentLocation();
      setLocationData(data);
      // 自动将获取到的IP填入输入框
      const segments = ipToSegments(data.ip);
      setIpSegments(segments);
      message.success('当前IP地理位置获取成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取当前位置失败';
      message.error(errorMessage);
    } finally {
      setCurrentIpLoading(false);
    }
  };

  return {
    locationData,
    loading,
    currentIpLoading,
    ipSegments,
    setIpSegments,
    searchIpLocation,
    getCurrentLocation
  };
};
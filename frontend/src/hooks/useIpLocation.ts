import { useState } from 'react';
import { message } from 'antd';
import { ipToSegments } from '../utils/ipUtils';
import { IpLocationService } from '../utils/apiService';

export interface LocationData {
  ip: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

/**
 * IP地理位置查询 Hook
 */
export const useIpLocation = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIpLoading, setCurrentIpLoading] = useState(false);
  const [ipSegments, setIpSegments] = useState<string[]>(['', '', '', '']);

  /**
   * 查询指定IP的地理位置
   * @param ip IP地址
   */
  const searchIpLocation = async (ip: string) => {
    if (!ip || ip === '...' || ip.split('.').some(segment => segment === '')) {
      message.error('请输入完整的IP地址');
      return;
    }

    setLoading(true);
    try {
      const data = await IpLocationService.queryIpLocation(ip);
      setLocationData(data);
      message.success('查询成功');
    } catch (error) {
      console.error('查询IP位置失败:', error);
      message.error('查询失败，请检查IP地址是否正确');
      setLocationData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取当前IP的地理位置
   */
  const getCurrentLocation = async () => {
    setCurrentIpLoading(true);
    try {
      const data = await IpLocationService.getCurrentLocation();
      setLocationData(data);
      // 更新IP输入框显示当前IP
      setIpSegments(ipToSegments(data.ip));
      message.success('获取当前位置成功');
    } catch (error) {
      console.error('获取当前IP位置失败:', error);
      message.error('获取当前位置失败');
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
    getCurrentLocation,
    setLocationData
  };
};
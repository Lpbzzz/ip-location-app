import axios from 'axios';

/**
 * 位置数据接口
 */
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
 * API基础URL
 * 生产环境使用相对路径，开发环境使用完整URL
 */
const API_BASE_URL = import.meta.env.PROD 
  ? '' // 生产环境使用相对路径
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');

/**
 * IP地理位置API服务
 */
export class IpLocationService {
  /**
   * 查询指定IP的地理位置
   * @param ip IP地址
   * @returns 位置数据
   */
  static async queryIpLocation(ip: string): Promise<LocationData> {
    const response = await axios.get(`${API_BASE_URL}/api/ip-location/query?ip=${ip}`);
    return response.data;
  }

  /**
   * 获取当前IP的地理位置
   * @returns 位置数据
   */
  static async getCurrentLocation(): Promise<LocationData> {
    const response = await axios.get(`${API_BASE_URL}/api/ip-location/current`);
    return response.data;
  }
}
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';

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

@Injectable()
export class IpLocationService {
  private getAxiosConfig() {
    const config: any = {};
    
    // 检查是否有代理配置
    const httpProxy = process.env.http_proxy || process.env.HTTP_PROXY;
    const httpsProxy = process.env.https_proxy || process.env.HTTPS_PROXY;
    
    if (httpProxy) {
      config.httpAgent = new HttpProxyAgent(httpProxy);
    }
    if (httpsProxy) {
      config.httpsAgent = new HttpsProxyAgent(httpsProxy);
    }
    
    return config;
  }

  async getLocationByIp(ip: string): Promise<LocationData> {
    try {
      // 使用免费的IP地理位置API
      const response = await axios.get(`http://ip-api.com/json/${ip}`, this.getAxiosConfig());
      const data = response.data;
      
      if (data.status === 'fail') {
        throw new Error(data.message || 'Invalid IP address');
      }
      
      return {
        ip: data.query,
        country: data.country,
        region: data.regionName,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        isp: data.isp
      };
    } catch (error) {
      throw new Error(`Failed to get location for IP ${ip}: ${error.message}`);
    }
  }
  
  async getCurrentIpLocation(ip?: string): Promise<LocationData> {
    try {
      if (ip) {
        // 如果提供了IP地址，直接查询该IP
        return this.getLocationByIp(ip);
      }
      
      // 获取当前IP地址
      const ipResponse = await axios.get('http://ip-api.com/json/', this.getAxiosConfig());
      return this.getLocationByIp(ipResponse.data.query);
    } catch (error) {
      throw new Error(`Failed to get current IP location: ${error.message}`);
    }
  }
}
import { Controller, Get, Query, BadRequestException, Req } from '@nestjs/common';
import { IpLocationService, LocationData } from './ip-location.service';

@Controller('api/ip-location')
export class IpLocationController {
  constructor(private readonly ipLocationService: IpLocationService) {}

  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }

  @Get('current')
  async getCurrentLocation(@Req() request: any): Promise<LocationData> {
    try {
      // 从请求头中获取用户的真实IP地址
      const userIp = this.getUserIpFromRequest(request);
      
      // 检查是否为本地IP地址（IPv4和IPv6）
      const isLocalIp = this.isLocalIpAddress(userIp);
      
      if (isLocalIp) {
        // 如果是本地IP，直接获取公网IP
        return await this.ipLocationService.getCurrentIpLocation();
      } else {
        // 如果是公网IP，使用该IP查询
        return await this.ipLocationService.getCurrentIpLocation(userIp);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private getUserIpFromRequest(request: any): string {
    // 尝试从各种可能的头部获取真实IP
    const forwarded = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    const cfConnectingIp = request.headers['cf-connecting-ip']; // Cloudflare
    const vercelForwardedFor = request.headers['x-vercel-forwarded-for']; // Vercel
    
    if (vercelForwardedFor && typeof vercelForwardedFor === 'string') {
      return vercelForwardedFor.split(',')[0].trim();
    }
    
    if (cfConnectingIp && typeof cfConnectingIp === 'string') {
      return cfConnectingIp;
    }
    
    if (realIp && typeof realIp === 'string') {
      return realIp;
    }
    
    if (forwarded && typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    
    // 如果都没有，使用连接的远程地址
    return request.connection.remoteAddress || request.socket.remoteAddress || '127.0.0.1';
  }

  private isLocalIpAddress(ip: string): boolean {
    // 检查IPv4本地地址
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return true;
    }
    
    // 检查IPv6本地地址
    if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
      return true;
    }
    
    return false;
  }

  @Get('query')
  async getLocationByIp(@Query('ip') ip: string): Promise<LocationData> {
    if (!ip) {
      throw new BadRequestException('IP address is required');
    }
    
    // 简单的IP地址格式验证
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      throw new BadRequestException('Invalid IP address format');
    }
    
    try {
      return await this.ipLocationService.getLocationByIp(ip);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
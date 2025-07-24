import React, { useState, useRef } from 'react';
import { Layout, Input, Button, Card, Row, Col, Typography, Space, message } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import axios from 'axios';
import MapComponent from './components/MapComponent';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface LocationData {
  ip: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

function App() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIpLoading, setCurrentIpLoading] = useState(false);
  const [ipSegments, setIpSegments] = useState(['', '', '', '']);
  
  // 创建输入框的引用
  const inputRefs = useRef<(InputRef | null)[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  // IP地址格式验证函数
  const validateIpAddress = (ip: string): boolean => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

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
      const response = await axios.get(`${API_BASE_URL}/api/ip-location/query?ip=${trimmedIp}`);
      setLocationData(response.data);
      message.success('IP地理位置查询成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '查询失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setCurrentIpLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ip-location/current`);
      setLocationData(response.data);
      // 自动将获取到的IP填入输入框
      const segments = response.data.ip.split('.');
      setIpSegments(segments.length === 4 ? segments : ['', '', '', '']);
      message.success('当前IP地理位置获取成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取当前位置失败';
      message.error(errorMessage);
    } finally {
      setCurrentIpLoading(false);
    }
  };

  // 处理IP段输入变化
  const handleIpSegmentChange = (index: number, value: string) => {
    // 只允许数字输入
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // 限制每段最大值为255
    const segmentValue = numericValue ? Math.min(parseInt(numericValue), 255).toString() : '';
    
    const newSegments = [...ipSegments];
    newSegments[index] = segmentValue;
    setIpSegments(newSegments);
    
    // 如果输入了点号或者当前段已经是3位数，自动跳到下一个输入框
    if ((value.includes('.') || segmentValue.length === 3) && index < 3) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        // 自动选中所有文本
        setTimeout(() => {
          nextInput.select();
        }, 0);
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按下点号时跳到下一个输入框
    if (e.key === '.' && index < 3) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        // 自动选中所有文本
        setTimeout(() => {
          nextInput.select();
        }, 0);
      }
    }
    // 按下退格键且当前输入框为空时，跳到上一个输入框
    else if (e.key === 'Backspace' && ipSegments[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 执行IP查询
  const handleSearch = () => {
    const ip = ipSegments.join('.');
    searchIpLocation(ip);
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header 
        className="header" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div 
          className="header-content" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <GlobalOutlined 
            style={{
              fontSize: '28px',
              color: '#fff',
              marginRight: '12px'
            }} 
          />
          <Title 
             level={2} 
             style={{
               color: '#fff',
               margin: 0,
               fontWeight: 600
             }}
             className="responsive-title"
           >
            IP地理位置查询
          </Title>
        </div>
      </Header>
      
      <Content 
         className="content" 
         style={{
           padding: '16px',
           background: '#f5f5f5'
         }}
       >
        <div 
          className="container" 
          style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          <Card 
            className="search-card" 
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="search-section">
                <Title 
                  level={4} 
                  style={{
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '24px'
                  }}
                >
                  查询IP地理位置
                </Title>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  {/* IP输入框区域 */}
                  <div 
                    className="ip-input-container"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      flexWrap: 'nowrap'
                    }}
                  >
                    {ipSegments.map((segment, index) => (
                      <React.Fragment key={index}>
                        <Input
                          ref={(el) => { inputRefs.current[index] = el; }}
                          value={segment}
                          onChange={(e) => handleIpSegmentChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          placeholder="0"
                          size="large"
                          style={{ 
                            width: '60px', 
                            textAlign: 'center',
                            fontSize: '16px',
                            borderRadius: '8px'
                          }}
                          maxLength={3}
                        />
                        {index < 3 && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>.</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* 查询按钮区域 */}
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    size="large"
                    onClick={handleSearch}
                    loading={loading}
                    style={{ 
                      borderRadius: '8px',
                      height: '48px',
                      paddingLeft: '32px',
                      paddingRight: '32px',
                      minWidth: '140px',
                      fontSize: '16px'
                    }}
                  >
                    查询位置
                  </Button>
                </div>
              </div>
              
              <div className="current-ip-section" style={{ textAlign: 'center' }}>
                <Button 
                  type="default" 
                  icon={<EnvironmentOutlined />}
                  size="large"
                  onClick={getCurrentLocation}
                  loading={currentIpLoading}
                  style={{
                    borderRadius: '8px',
                    height: '48px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    border: '1px solid #d9d9d9'
                  }}
                >
                  获取当前IP位置
                </Button>
              </div>
            </Space>
          </Card>

          {locationData && (
            <Row gutter={[24, 24]} className="result-section">
              <Col xs={24} lg={12}>
                <Card title="位置信息" className="info-card">
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div className="info-item">
                      <Text strong>IP地址: </Text>
                      <Text code>{locationData.ip}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>国家: </Text>
                      <Text>{locationData.country}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>地区: </Text>
                      <Text>{locationData.region}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>城市: </Text>
                      <Text>{locationData.city}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>经纬度: </Text>
                      <Text>{locationData.latitude}, {locationData.longitude}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>时区: </Text>
                      <Text>{locationData.timezone}</Text>
                    </div>
                    <div className="info-item">
                      <Text strong>ISP: </Text>
                      <Text>{locationData.isp}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card title="地图位置" className="map-card">
                  <MapComponent 
                    latitude={locationData.latitude} 
                    longitude={locationData.longitude}
                    city={locationData.city}
                    country={locationData.country}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;

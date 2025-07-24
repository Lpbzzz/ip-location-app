import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useIpLocation } from '../hooks/useIpLocation';
import { segmentsToIp } from '../utils/ipUtils';
import IpInput from '../components/IpInput';
import LocationInfo from '../components/LocationInfo';

const { Title } = Typography;

/**
 * 主页面组件
 */
const HomePage: React.FC = () => {
  const {
    locationData,
    loading,
    currentIpLoading,
    ipSegments,
    setIpSegments,
    searchIpLocation,
    getCurrentLocation
  } = useIpLocation();

  // 执行IP查询
  const handleSearch = () => {
    const ip = segmentsToIp(ipSegments);
    searchIpLocation(ip);
  };

  return (
    <>
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
              <IpInput 
                ipSegments={ipSegments}
                onIpSegmentsChange={setIpSegments}
              />
              
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
        <LocationInfo locationData={locationData} />
      )}
    </>
  );
};

export default HomePage;
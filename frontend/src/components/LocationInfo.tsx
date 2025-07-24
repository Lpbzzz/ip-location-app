import React from 'react';
import { Card, Space, Typography, Row, Col } from 'antd';
import type { LocationData } from '../utils/apiService';
import MapComponent from './MapComponent';

const { Text } = Typography;

interface LocationInfoProps {
  locationData: LocationData;
}

/**
 * 位置信息显示组件
 */
const LocationInfo: React.FC<LocationInfoProps> = ({ locationData }) => {
  return (
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
  );
};

export default LocationInfo;
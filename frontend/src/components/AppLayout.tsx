import React from 'react';
import { Layout, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * 应用布局组件
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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
          {children}
        </div>
      </Content>
    </Layout>
  );
};

export default AppLayout;
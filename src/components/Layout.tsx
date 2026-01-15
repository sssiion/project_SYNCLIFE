import React from 'react';
import { Layout as AntLayout, Typography, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Header, Content } = AntLayout;
const { Title } = Typography;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <AntLayout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Header style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        K
                    </div>
                    <Title level={4} style={{ margin: 0, color: 'white' }}>
                        SyncLife Kanban
                    </Title>
                </div>

                <Button
                    type="text"
                    icon={<GithubOutlined />}
                    style={{ color: 'white' }}
                    href="https://github.com/sssiion/project_SYNCLIFE"
                    target="_blank"
                >
                    GitHub
                </Button>
            </Header>

            <Content style={{ padding: '24px', overflowY: 'auto' }}>
                {children}
            </Content>
        </AntLayout>
    );
};

export default Layout;

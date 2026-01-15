import React from 'react';
import { Layout as AntLayout } from 'antd';

const { Header, Content } = AntLayout;

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <AntLayout style={{ minHeight: '100vh', background: 'transparent' }}>
            <Header style={{
                background: 'transparent',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Centered logo since controls are gone? Or leave left. Left is fine.
                padding: '0 24px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>


            </Header>

            <Content style={{ padding: '24px', overflowY: 'visible' }}>
                {children}
            </Content>
        </AntLayout>
    );
};

export default Layout;

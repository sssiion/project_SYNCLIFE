import React, { useState } from 'react';
import { Hand, MousePointer2 } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTaskStore } from '../store/useTaskStore';

const OnboardingOverlay: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const completeTutorial = useTaskStore((state) => state.completeTutorial);
    const [isVisible, setIsVisible] = useState(true);

    const handleComplete = () => {
        setIsVisible(false);
        // Delay actual completion to allow fade out animation
        setTimeout(() => {
            completeTutorial();
        }, 500);
    };

    if (!isVisible) return null;

    return (
        <div
            onClick={handleComplete}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.5s ease',
            }}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                textAlign: 'center',
                color: '#2c3e50',
                padding: '0 20px',
            }}>
                {isMobile ? (
                    <>
                        <div className="swipe-hand-animation">
                            <Hand size={64} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>카드를 밀어서 변경</h2>
                            <p style={{ fontSize: '16px', color: '#596275' }}>
                                카드를 좌우로 밀어서(Swipe)<br />
                                다른 컬럼으로 이동시키세요.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="drag-mouse-animation">
                            <MousePointer2 size={64} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 700 }}>카드를 들어서 이동</h2>
                            <p style={{ fontSize: '18px', color: '#596275' }}>
                                마우스로 카드를 잡고(Drag)<br />
                                원하는 컬럼으로 옮겨보세요.
                            </p>
                        </div>
                    </>
                )}

                <p style={{
                    marginTop: '32px',
                    fontSize: '14px',
                    color: '#b2bec3',
                    animation: 'pulse 2s infinite'
                }}>
                    화면을 터치하면 시작합니다
                </p>
            </div>
        </div>
    );
};

export default OnboardingOverlay;

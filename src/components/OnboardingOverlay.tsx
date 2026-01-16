import React, { useState, useEffect } from 'react';
import { Hand, ArrowUp, ArrowDown, Clock, Star, MoreVertical, X, Search, ChevronDown, MousePointer2, Calendar, Moon, HelpCircle, LayoutGrid, CheckCircle2, ChevronLeft, ArrowRight, Repeat } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

const OnboardingOverlay: React.FC = () => {
    const { hasSeenTutorial, completeTutorial, isDarkMode } = useTaskStore();

    // Steps configuration
    const [step, setStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    // Check for mobile view for Step 8 (Settings)
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Typing animation state for Step 7 (Task Creation)
    const [typingTitle, setTypingTitle] = useState('');
    const fullTitle = 'SyncLife 개발 완료하기';

    useEffect(() => {
        let interval: any;
        if (step === 7) {
            let i = 0;
            interval = setInterval(() => {
                setTypingTitle(fullTitle.slice(0, i));
                i++;
                if (i > fullTitle.length) {
                    setTimeout(() => { i = 0; }, 1000); // Loop
                }
            }, 120);
        } else {
            setTypingTitle('');
        }
        return () => clearInterval(interval);
    }, [step]);

    // If already seen, don't render (unless reset)
    if (hasSeenTutorial) return null;

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        let next = step + 1;

        // Skip precision move (Step 3) on desktop
        if (!isMobileView && next === 3) {
            next = 4;
        }

        // Skip keyboard shortcuts on mobile
        if (isMobileView && next === 9) {
            handleComplete();
            return;
        }

        // Max step is 9 now (Welcome, Menu, Drag, Reorder, Search, Filter, Column, Create, Settings, Shortcuts)
        if (next > 9) {
            handleComplete();
        } else {
            setStep(next);
        }
    };

    const stepList = isMobileView
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
        : [0, 1, 2, 4, 5, 6, 7, 8, 9];
    const currentStepIndex = stepList.indexOf(step);

    const handleComplete = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsExiting(true);
        setTimeout(() => {
            completeTutorial();
        }, 500);
    };

    // Card Mock Component for reuse
    const MockCard = ({ overlay, style }: { overlay?: React.ReactNode, style?: React.CSSProperties }) => (
        <div style={{
            background: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#eef2ff',
            borderRadius: '16px',
            boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.05)',
            padding: '16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            zIndex: 1,
            position: 'relative',
            ...style
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                    background: '#dcfce7', color: '#166534',
                    padding: '4px 8px', borderRadius: '6px',
                    fontSize: '10px', fontWeight: 700
                }}>
                    LOW
                </div>
                <div style={{ display: 'flex', gap: '8px', opacity: 0.4 }}>
                    <Star size={14} />
                    <MoreVertical size={14} />
                </div>
            </div>

            <div style={{ fontSize: '14px', fontWeight: 700, color: isDarkMode ? '#e2e8f0' : '#1e293b', textAlign: 'left', marginTop: '4px' }}>
                API 명세서 검토
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                <Clock size={11} />
                <span>1월 16일</span>
            </div>
            {overlay}
        </div>
    );

    // Reusable Next Button
    const NextButton = () => (
        <button
            onClick={handleNext}
            style={{
                marginTop: '32px',
                background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px',
                fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(108, 92, 231, 0.2)',
                transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            다음
        </button>
    );

    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999,
                background: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                opacity: isExiting ? 0 : 1, transition: 'opacity 0.5s ease',
                padding: '20px', boxSizing: 'border-box',
                cursor: (step === 9 || (isMobileView && step === 8)) ? 'pointer' : 'default'
            }}
            onClick={(step === 9 || (isMobileView && step === 8)) ? () => handleComplete() : undefined}
        >
            {/* Progress Indicator */}
            <div style={{ position: 'absolute', top: '40px', display: 'flex', gap: '8px' }}>
                {stepList.map((s, idx) => (
                    <div key={s} style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: idx === currentStepIndex ? '#6c5ce7' : (isDarkMode ? '#4a4a4a' : '#dfe6e9'),
                        transition: 'all 0.3s'
                    }} />
                ))}
            </div>

            {/* Step 0: Welcome */}
            {step === 0 && (
                <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                    <h1 style={{ fontSize: '28px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', marginBottom: '12px', fontWeight: 800 }}>Welcome to SyncLife</h1>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72', lineHeight: '1.6' }}>간단하고 강력한 태스크 관리,<br />SyncLife 사용 방법을 알려드릴게요.</p>
                    <NextButton />
                </div>
            )}

            {/* Step 1: Menu */}
            {step === 1 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: isDarkMode ? '#2d3436' : '#f1f2f6', borderRadius: '24px', padding: '32px', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDarkMode ? '#3a4042' : '#fff', boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '20px', height: '2px', background: isDarkMode ? '#e2e8f0' : '#2c3e50', boxShadow: isDarkMode ? '0 6px 0 #e2e8f0, 0 -6px 0 #e2e8f0' : '0 6px 0 #2c3e50, 0 -6px 0 #2c3e50' }}></div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, marginBottom: '12px' }}>메뉴 & 사이드바</h2>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72' }}>우측 상단 <strong>메뉴 버튼</strong>을 눌러<br />사이드바를 열 수 있습니다.</p>
                    <NextButton />
                </div>
            )}

            {/* Step 2: Drag & Drop / Swipe Action */}
            {step === 2 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: isMobileView ? '400px' : '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {isMobileView ? (
                        // Mobile View: Swipe Action
                        <div style={{ background: isDarkMode ? '#2d3436' : '#f8f9fa', borderRadius: '24px', height: '220px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <div style={{ position: 'relative', width: '140px', height: '90px' }}>
                                <div style={{ animation: 'swipeDemo 4s infinite ease-in-out', position: 'absolute', inset: 0, zIndex: 2 }}>
                                    <MockCard />
                                </div>
                                <div style={{ position: 'absolute', top: '45px', left: '50%', animation: 'handSwipeDemo 4s infinite ease-in-out', zIndex: 10 }}>
                                    <Hand size={40} fill="#ffeaa7" color="#fffddbff" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Desktop View: Board Drag (with persistent completion)
                        <div style={{ background: isDarkMode ? '#2d3436' : '#f8f9fa', borderRadius: '24px', height: '380px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden', display: 'flex', gap: '18px', width: '600px', margin: '0 auto', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
                            {['To Do', 'In Progress', 'Done'].map((col, idx) => (
                                <div key={idx} style={{ width: '172px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? '#6c5ce7' : idx === 1 ? '#fd9644' : '#2bcbba' }} />
                                        <span style={{ fontSize: '12px', fontWeight: 800, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>{col}</span>
                                    </div>
                                    {idx === 1 && <div style={{ opacity: 0.3, height: '100px' }}><MockCard /></div>}
                                </div>
                            ))}

                            {/* The Animated Card */}
                            <div style={{
                                position: 'absolute',
                                top: '64px',
                                left: '30px',
                                width: '170px',
                                height: '100px',
                                animation: 'desktopDragPersistent 5s infinite ease-in-out',
                                zIndex: 10
                            }}>
                                <MockCard />
                                <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translate(-50%, 0)', zIndex: 11, animation: 'handGesturePersistent 5s infinite ease-in-out' }}>
                                    <Hand size={32} fill="#ffeaa7" color="#fffddbff" />
                                </div>
                            </div>
                        </div>
                    )}

                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, marginBottom: '12px' }}>
                        {isMobileView ? '스와이프로 이동' : '카드를 들어서 이동'}
                    </h2>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72', lineHeight: '1.6' }}>
                        {isMobileView ? (
                            <>카드를 좌우로 <strong>스와이프(밀기)</strong>하여<br />다른 컬럼으로 자유롭게 옮길 수 있습니다.</>
                        ) : (
                            <>카드를 <strong>클릭하여 길게 누르거나 드래그</strong>하면<br />공중에 들어 올린 듯한 모습으로 자유롭게 이동할 수 있습니다.</>
                        )}
                    </p>
                    <NextButton />
                </div>
            )}

            {/* Step 3: Reordering (Double Click) */}
            {step === 3 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: isDarkMode ? '#2d3436' : '#f8f9fa', borderRadius: '24px', height: '220px', padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '280px', height: '100px' }}>
                            <MockCard overlay={
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                                    borderRadius: '16px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(2px)',
                                    animation: 'fadeIn 0.3s'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                        <div style={{ width: '40px', height: '40px', background: isDarkMode ? '#3a4042' : 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)' }}>
                                            <ArrowUp size={20} color={isDarkMode ? '#e2e8f0' : '#2d3436'} />
                                        </div>
                                        <div style={{ width: '40px', height: '40px', background: isDarkMode ? '#3a4042' : 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)' }}>
                                            <ArrowDown size={20} color={isDarkMode ? '#e2e8f0' : '#2d3436'} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: isDarkMode ? '#e2e8f0' : '#2d3436', fontWeight: 600 }}>
                                        <X size={14} /> 닫기
                                    </div>
                                </div>
                            } />
                            <div style={{ position: 'absolute', inset: 0, border: '3px solid #6c5ce7', borderRadius: '16px', zIndex: 10, animation: 'ping 1.5s infinite' }}></div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, marginBottom: '12px' }}>정밀 이동 (Double Click)</h2>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72' }}>카드를 <strong>두 번 클릭</strong>하면<br />위아래로 순서를 정밀하게 옮길 수 있습니다.</p>
                    <NextButton />
                </div>
            )}

            {/* Step 4: Search & Favorites */}
            {step === 4 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white', borderRadius: '16px', padding: '10px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.02)', position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={16} color={isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8"} />
                            <div style={{ fontSize: '13px', color: isDarkMode ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>검색어를 입력하세요.</div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Star size={16} color="#6c5ce7" fill="#6c5ce7" style={{ animation: 'pulse 1.5s infinite' }} />
                            <div style={{
                                position: 'absolute', top: '18px', right: '-15px',
                                background: '#6c5ce7', color: 'white',
                                padding: '4px 10px', borderRadius: '8px',
                                fontSize: '10px', whiteSpace: 'nowrap',
                                fontWeight: 700, zIndex: 10,
                                boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)'
                            }}>
                                즐겨찾기 모드
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', opacity: isDarkMode ? 0.3 : 0.5, marginTop: '12px' }}>
                        {[{ label: '우선순위' }, { label: '마감일' }, { label: '제목' }].map((f, i) => (
                            <div key={i} style={{ flex: 1, background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '12px', padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                                <span style={{ fontSize: '10px', color: isDarkMode ? '#e2e8f0' : '#94a3b8', fontWeight: 600 }}>{f.label}</span>
                                <ChevronDown size={10} color={isDarkMode ? '#e2e8f0' : '#94a3b8'} />
                            </div>
                        ))}
                    </div>
                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, margin: '24px 0 12px' }}>검색 & 즐겨찾기</h2>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72', lineHeight: '1.6' }}>
                        검색바의 <strong>별표 아이콘</strong>을 눌러<br />즐겨찾기한 할일만 모아볼 수 있습니다.
                    </p>
                    <NextButton />
                </div>
            )}

            {/* Step 7: Task Creation (Mock Modal) */}
            {step === 7 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: '360px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: isDarkMode ? '#2d3436' : 'white', borderRadius: '20px', padding: '20px', width: '100%', boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)', position: 'relative', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>새로운 업무</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: isDarkMode ? '#94a3b8' : '#b2bec3', fontSize: '12px' }}>
                                    priority <ChevronDown size={12} />
                                </div>
                                <X size={16} color={isDarkMode ? '#94a3b8' : '#b2bec3'} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: isDarkMode ? '#a0aec0' : '#636e72', marginBottom: '6px' }}>
                                <span style={{ color: '#ff7675' }}>*</span> Title
                            </div>
                            <div style={{ width: '100%', height: '36px', border: '2px solid #6c5ce7', borderRadius: '10px', padding: '0 12px', display: 'flex', alignItems: 'center', color: isDarkMode ? '#e2e8f0' : '#2d3436', fontWeight: 600, fontSize: '13px', position: 'relative', boxSizing: 'border-box' }}>
                                {typingTitle}
                                <div style={{ width: '2px', height: '16px', background: '#6c5ce7', marginLeft: '2px', animation: 'blink 0.8s infinite' }} />
                                {/* Visual Arrow pointing to title */}
                                <div style={{ position: 'absolute', right: '-15px', top: '10px', animation: 'arrowMove 1.5s infinite' }}>
                                    <MousePointer2 size={24} color="#6c5ce7" fill="#6c5ce7" />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: isDarkMode ? '#a0aec0' : '#636e72', marginBottom: '6px' }}>Tags (Max 3)</div>
                            <div style={{ width: '100%', height: '36px', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #dfe6e9', borderRadius: '10px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isDarkMode ? '#4a4a4a' : '#b2bec3', fontSize: '12px', boxSizing: 'border-box' }}>
                                태그를 입력하세요 <ChevronDown size={14} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: isDarkMode ? '#a0aec0' : '#636e72', marginBottom: '6px' }}>Deadline (Optional)</div>
                            <div style={{ width: '100%', height: '36px', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #dfe6e9', borderRadius: '10px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: isDarkMode ? '#4a4a4a' : '#b2bec3', fontSize: '12px', boxSizing: 'border-box' }}>
                                마감일을 선택해주세요 <Calendar size={14} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: isDarkMode ? '#a0aec0' : '#636e72', marginBottom: '6px' }}>Description (Optional)</div>
                            <div style={{ width: '100%', height: '60px', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #dfe6e9', borderRadius: '10px', padding: '10px', color: isDarkMode ? '#4a4a4a' : '#b2bec3', fontSize: '12px', lineHeight: '1.4', boxSizing: 'border-box' }}>상세 내용을 입력해주세요.</div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <div style={{ width: '60px', height: '36px', borderRadius: '10px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #dfe6e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: isDarkMode ? '#a0aec0' : '#636e72', fontSize: '13px' }}>취소</div>
                            <div style={{ width: '60px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2c3e50', boxShadow: '0 4px 12px rgba(161, 196, 253, 0.4)', fontSize: '13px' }}>생성</div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '20px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, margin: '20px 0 8px' }}>새 할일 상세 설정</h2>
                    <p style={{ fontSize: '14px', color: isDarkMode ? '#a0aec0' : '#636e72', lineHeight: '1.6' }}>우선순위, 업무명, 태그, 마감일, 상세내용을<br />자유롭게 입력하여 할일을 꼼꼼하게 관리하세요!</p>
                    <NextButton />
                </div>
            )}

            {/* Step 8: Settings & Activity */}
            {step === 8 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: isMobileView ? '320px' : '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: isDarkMode ? '#2d3436' : '#f8fbff', borderRadius: '24px', padding: isMobileView ? '16px' : '20px', width: '100%', boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Settings Header (Mobile Only Look) */}
                        {isMobileView && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', padding: '0 4px' }}>
                                <ChevronLeft size={20} color={isDarkMode ? '#e2e8f0' : '#2d3436'} />
                                <span style={{ fontWeight: 800, fontSize: '16px', color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>Settings</span>
                                <ArrowRight size={20} color={isDarkMode ? '#e2e8f0' : '#2d3436'} style={{ opacity: 0.3 }} />
                            </div>
                        )}

                        {/* Activity Card Wrapper for Flip Animation */}
                        <div style={{ perspective: '1000px', height: '280px', width: '100%' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white', borderRadius: '20px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative',
                                transformStyle: 'preserve-3d',
                                animation: 'cardFlip 6s infinite ease-in-out'
                            }}>
                                <div style={{ backfaceVisibility: 'hidden', padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>Activity</span>
                                        <div style={{ fontSize: '16px' }}>📊</div>
                                    </div>

                                    {/* Donut Chart Mockup */}
                                    <div style={{ width: '100px', height: '100px', margin: '0 auto 20px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f2f6"} strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#a29bfe" strokeWidth="3" strokeDasharray="25, 100" />
                                        </svg>
                                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                                            <div style={{ fontSize: '18px', fontWeight: 900, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>25%</div>
                                            <div style={{ fontSize: '8px', color: isDarkMode ? '#94a3b8' : '#94a3b8', fontWeight: 700 }}>Complete</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                        {[
                                            { label: 'TOTAL', val: 12, icon: <LayoutGrid size={12} />, color: isDarkMode ? '#a0aec0' : '#636e72' },
                                            { label: 'ACTIVE', val: 3, icon: <div style={{ width: 8, height: 8, border: '2px solid #fdcb6e', borderRadius: '50%' }} />, color: '#fdcb6e' },
                                            { label: 'DONE', val: 3, icon: <CheckCircle2 size={12} />, color: '#79d7a2' }
                                        ].map((s, i) => (
                                            <div key={i} style={{ flex: 1, background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: '10px 4px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                <div style={{ color: s.color }}>{s.icon}</div>
                                                <div style={{ fontSize: '14px', fontWeight: 900, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>{s.val}</div>
                                                <div style={{ fontSize: '8px', fontWeight: 800, color: isDarkMode ? '#94a3b8' : '#94a3b8' }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Back Side: Priority Summary */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    display: 'flex', flexDirection: 'column',
                                    background: isDarkMode ? '#2d3436' : 'white', borderRadius: '20px', padding: '20px',
                                    boxSizing: 'border-box'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>Priority</span>
                                        <Repeat size={14} color={isDarkMode ? "#e2e8f0" : "#2d3436"} style={{ opacity: 0.4 }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                        {[
                                            { label: 'High', val: 5, color: '#bc6c4b' },
                                            { label: 'Medium', val: 4, color: '#e3be75' },
                                            { label: 'Low', val: 3, color: '#78ba9d' }
                                        ].map((p, i) => (
                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: p.color }}>{p.label}</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 800, color: p.color }}>{p.val}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '6px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(p.val / 5) * 85}%`, height: '100%', background: p.color, borderRadius: '3px' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dark Mode Row */}
                        <div style={{ background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white', borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f2f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Moon size={18} color={isDarkMode ? '#e2e8f0' : '#2d3436'} />
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '14px', color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>Dark Mode</span>
                            </div>
                            <div style={{ width: '44px', height: '22px', background: isDarkMode ? '#4834d4' : '#dfe6e9', borderRadius: '20px', padding: '2px', position: 'relative' }}>
                                <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transform: isDarkMode ? 'translateX(22px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
                            </div>
                        </div>

                        <div style={{
                            background: isDarkMode ? 'rgba(108, 92, 231, 0.1)' : '#f8faff',
                            borderRadius: '16px',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 20px rgba(108, 92, 231, 0.15)',
                            border: isDarkMode ? '2px solid #6c5ce7' : '2px solid #6c5ce7',
                            animation: 'pulse 1.5s infinite',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                    <HelpCircle size={18} color="#6c5ce7" />
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '14px', color: isDarkMode ? '#e2e8f0' : '#2d3436' }}>App Guide</span>
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 900, color: '#6c5ce7', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', padding: '4px 10px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>View Again</div>
                        </div>
                    </div>
                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, margin: '24px 0 10px' }}>설정 & 통계</h2>
                    <p style={{ fontSize: '15px', color: isDarkMode ? '#a0aec0' : '#636e72', lineHeight: '1.7' }}>
                        메뉴의 <strong>설정</strong>에서는 업무 통계를 한눈에 확인하고,<br />
                        다크 모드 설정 및 가이드를 언제든 다시 볼 수 있습니다!
                    </p>
                    <NextButton />
                </div>
            )}

            {/* Step 9: Shortcut Guide Summary */}
            {step === 9 && (
                <div className="animate-slide-up" style={{ textAlign: 'center', maxWidth: '400px', pointerEvents: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                        {[
                            { key: 'N', desc: '새 할일' },
                            { key: 'M', desc: '메뉴 토글' },
                            { key: 'S', desc: '검색 포커스' }
                        ].map(k => (
                            <div key={k.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '60px', height: '60px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '16px', boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: '#6c5ce7', border: '2px solid #6c5ce7' }}>{k.key}</div>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#a0aec0' : '#636e72' }}>{k.desc}</span>
                            </div>
                        ))}
                    </div>
                    <h2 style={{ fontSize: '24px', color: isDarkMode ? '#e2e8f0' : '#2c3e50', fontWeight: 700, marginBottom: '12px' }}>키보드 단축키</h2>
                    <p style={{ fontSize: '16px', color: isDarkMode ? '#a0aec0' : '#636e72', marginBottom: '32px' }}>데스크탑 사용자라면 단축키를 이용해<br />더욱 빠르게 작업할 수 있습니다.</p>
                    <button
                        onClick={handleNext}
                        style={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '14px', fontSize: '18px', fontWeight: 700, boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)', cursor: 'pointer', pointerEvents: 'auto' }}
                    >
                        시작하기
                    </button>
                    <p style={{ marginTop: '16px', fontSize: '14px', color: '#6c5ce7', fontWeight: 700, animation: 'pulse 1.5s infinite' }}>화면 아무 곳이나 클릭하여 가이드를 종료하세요!</p>
                </div>
            )}

            <style>{`
@keyframes desktopDragDemo {
    0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    10% { transform: translate(0, -10px) scale(1.05) rotate(2deg); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
    40%, 60% { transform: translate(194px, -10px) scale(1.05) rotate(2deg); filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15)); }
    70% { transform: translate(194px, 0) scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
}
@keyframes desktopDragPersistent {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    10% { transform: translate(0, -10px) scale(1.1) rotate(2deg); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2)); }
    30% { transform: translate(210px, -10px) scale(1.1) rotate(2deg); filter: drop-shadow(0 20px 30px rgba(0,0,0,0.2)); }
    40% { transform: translate(210px, 0) scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    85%, 100% { transform: translate(210px, 0) scale(1) rotate(0deg); }
}
@keyframes handGesture {
    0%, 100% { transform: translate(-50%, 0); }
    10%, 60% { transform: translate(-50%, -10px); }
    70% { transform: translate(-50%, 0); }
}
@keyframes handGesturePersistent {
    0% { transform: translate(-50%, 0); }
    10% { transform: translate(-50%, -10px); }
    30% { transform: translate(-50%, -10px); }
    40% { transform: translate(-50%, 0); opacity: 1; }
    45%, 100% { opacity: 0; transform: translate(-50%, 20px); }
}
@keyframes swipeDemo {
    0%, 50%, 100% { transform: translateX(0); }
    25% { transform: translateX(-60px); }
    75% { transform: translateX(60px); }
}
@keyframes handSwipeDemo {
    0%, 50%, 100% { transform: translateX(0);  }
    
    20% { transform: translateX(-60px); }
    70% { transform: translateX(60px); }
}
@keyframes cardFlip {
    0%, 20% { transform: rotateY(0deg); }
    40%, 60% { transform: rotateY(180deg); }
    80%, 100% { transform: rotateY(0deg); }
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.1); opacity: 0; } }
@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes arrowMove { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, 0); } }
@keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
.animate-slide-up { animation: slideUp 0.5s ease-out; }
`}</style>
        </div >
    );
};

export default OnboardingOverlay;

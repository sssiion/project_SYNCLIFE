import React from 'react';
import { Progress, Tooltip } from 'antd';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, Circle, ListTodo, Repeat } from 'lucide-react';

const StatisticsPanel: React.FC = () => {
    const tasks = useTaskStore((state) => state.tasks);
    const [isFlipped, setIsFlipped] = React.useState(false);

    // Front Stats
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

    // Back Stats (Priority) - Exclude DONE tasks
    const activeTasks = tasks.filter((t) => t.status !== 'DONE');
    const highPriority = activeTasks.filter((t) => t.priority === 'HIGH').length;
    const mediumPriority = activeTasks.filter((t) => t.priority === 'MEDIUM').length;
    const lowPriority = activeTasks.filter((t) => t.priority === 'LOW').length;
    const totalActive = activeTasks.length;

    // Calculate percentages
    const donePercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // Ant Design Progress format
    const format = (percent?: number) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{percent}%</span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Complete</span>
        </div>
    );

    return (
        <div
            style={{
                perspective: '1000px',
                width: '100%',
                minHeight: '300px', // Ensure sufficient height for both faces
                cursor: 'pointer'
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
                {/* --- FRONT FACE --- */}
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '24px',
                        background: 'var(--glass-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                        // Fix overlap: Hide when flipped (delayed to mid-flip)
                        opacity: isFlipped ? 0 : 1,
                        visibility: isFlipped ? 'hidden' : 'visible',
                        transition: 'opacity 0s linear 0.15s, visibility 0s linear 0.15s', // Swap at 90deg (approx)
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, padding: '20px 0 0 20px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Activity</h3>
                        <span style={{ fontSize: '20px', padding: '20px 20px 0 0' }}>📊</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Progress
                            type="circle"
                            percent={donePercent}
                            strokeColor={{ '0%': '#a1c4fd', '100%': '#c2e9fb' }}
                            railColor="rgba(255,255,255,0.6)"
                            format={format}
                            size={120}
                            strokeWidth={8}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <Tooltip title="Total Tasks">
                            <div style={{
                                padding: '8px', borderRadius: '12px',
                                marginBottom: '8px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <ListTodo size={16} color="var(--text-primary)" />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalTasks}</span>
                                <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>TOTAL</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="In Progress">
                            <div style={{
                                padding: '8px', borderRadius: '12px',
                                marginBottom: '8px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <Circle size={16} color="#f1c40f" fill="#f1c40f" fillOpacity={0.2} />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{inProgressTasks}</span>
                                <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>ACTIVE</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Completed">
                            <div style={{
                                padding: '8px', borderRadius: '12px',
                                marginBottom: '8px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <CheckCircle2 size={16} color="#2ecc71" fill="#2ecc71" fillOpacity={0.2} />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{doneTasks}</span>
                                <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>DONE</span>
                            </div>
                        </Tooltip>
                    </div>
                </div>

                {/* --- BACK FACE (Priority) --- */}
                <div
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '24px',
                        background: 'var(--glass-bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                        // Fix overlap: Hide when not flipped (delayed to mid-flip)
                        opacity: isFlipped ? 1 : 0,
                        visibility: isFlipped ? 'visible' : 'hidden',
                        transition: 'opacity 0s linear 0.15s, visibility 0s linear 0.15s',
                    }}
                >   <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Priority</h3>
                            <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}><Repeat size={14} color="#2d3436" style={{ opacity: 0.4 }} /></span>
                        </div>
                        <div style={{ width: '100%', height: "50px" }} ></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                            {/* High */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#e17055', fontWeight: 600 }}>
                                    <span>High</span>
                                    <span>{highPriority}</span>
                                </div>
                                <Progress percent={totalActive ? (highPriority / totalActive) * 100 : 0} showInfo={false} strokeColor="#e17055" railColor="rgba(255,255,255,0.5)" size="small" />
                            </div>
                            {/* Medium */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#fdcb6e', fontWeight: 600 }}>
                                    <span>Medium</span>
                                    <span>{mediumPriority}</span>
                                </div>
                                <Progress percent={totalActive ? (mediumPriority / totalActive) * 100 : 0} showInfo={false} strokeColor="#fdcb6e" railColor="rgba(255,255,255,0.5)" size="small" />
                            </div>
                            {/* Low */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#00b894', fontWeight: 600 }}>
                                    <span>Low</span>
                                    <span>{lowPriority}</span>
                                </div>
                                <Progress percent={totalActive ? (lowPriority / totalActive) * 100 : 0} showInfo={false} strokeColor="#00b894" railColor="rgba(255,255,255,0.5)" size="small" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPanel;

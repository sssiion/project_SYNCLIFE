import React from 'react';
import { Progress, Tooltip } from 'antd';
import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

const StatisticsPanel: React.FC = () => {
    const tasks = useTaskStore((state) => state.tasks);
    const [isFlipped, setIsFlipped] = React.useState(false);

    // Front Stats
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

    // Back Stats (Priority)
    const highPriority = tasks.filter((t) => t.priority === 'HIGH').length;
    const mediumPriority = tasks.filter((t) => t.priority === 'MEDIUM').length;
    const lowPriority = tasks.filter((t) => t.priority === 'LOW').length;

    // Calculate percentages
    const donePercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    // Ant Design Progress format
    const format = (percent?: number) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>{percent}%</span>
            <span style={{ fontSize: '10px', color: '#7f8c8d' }}>Complete</span>
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
                        background: 'rgba(255, 255, 255, 0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        paddingBottom: '16px',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, padding: '10px 0 0 10px', fontSize: '14px', fontWeight: 600, color: '#34495e' }}>Activity</h3>
                        <span style={{ fontSize: '20px', padding: '10px 10px 0 0' }}>📊</span>
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
                                background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '12px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <ListTodo size={16} color="#34495e" />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>{totalTasks}</span>
                                <span style={{ fontSize: '9px', color: '#7f8c8d' }}>TOTAL</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="In Progress">
                            <div style={{
                                background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '12px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <Circle size={16} color="#f1c40f" fill="#f1c40f" fillOpacity={0.2} />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>{inProgressTasks}</span>
                                <span style={{ fontSize: '9px', color: '#7f8c8d' }}>ACTIVE</span>
                            </div>
                        </Tooltip>
                        <Tooltip title="Completed">
                            <div style={{
                                background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: '12px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                            }}>
                                <CheckCircle2 size={16} color="#2ecc71" fill="#2ecc71" fillOpacity={0.2} />
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>{doneTasks}</span>
                                <span style={{ fontSize: '9px', color: '#7f8c8d' }}>DONE</span>
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
                        padding: '20px',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.45)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#34495e' }}>Priority</h3>
                        <span style={{ fontSize: '16px', color: '#7f8c8d' }}>↩</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                        {/* High */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#e17055', fontWeight: 600 }}>
                                <span>High</span>
                                <span>{highPriority}</span>
                            </div>
                            <Progress percent={totalTasks ? (highPriority / totalTasks) * 100 : 0} showInfo={false} strokeColor="#e17055" railColor="rgba(255,255,255,0.5)" size="small" />
                        </div>
                        {/* Medium */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#fdcb6e', fontWeight: 600 }}>
                                <span>Medium</span>
                                <span>{mediumPriority}</span>
                            </div>
                            <Progress percent={totalTasks ? (mediumPriority / totalTasks) * 100 : 0} showInfo={false} strokeColor="#fdcb6e" railColor="rgba(255,255,255,0.5)" size="small" />
                        </div>
                        {/* Low */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#00b894', fontWeight: 600 }}>
                                <span>Low</span>
                                <span>{lowPriority}</span>
                            </div>
                            <Progress percent={totalTasks ? (lowPriority / totalTasks) * 100 : 0} showInfo={false} strokeColor="#00b894" railColor="rgba(255,255,255,0.5)" size="small" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPanel;

import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import type { Task, Priority } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface NewTaskModalProps {
    visible: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ visible, onClose, taskToEdit }) => {
    const [form] = Form.useForm();
    const addTask = useTaskStore((state) => state.addTask);
    const updateTask = useTaskStore((state) => state.updateTask);

    // Manage priority state manually since header is outside Form context
    const isDarkMode = useTaskStore((state) => state.isDarkMode);
    const [priority, setPriority] = useState<Priority | undefined>(undefined);

    React.useEffect(() => {
        if (visible) {
            if (taskToEdit) {
                form.setFieldsValue({
                    title: taskToEdit.title,
                    description: taskToEdit.description,
                    dueDate: taskToEdit.dueDate ? dayjs(taskToEdit.dueDate) : undefined,
                    tags: taskToEdit.tags,
                });
                setPriority(taskToEdit.priority);
            } else {
                form.resetFields();
                setPriority(undefined);
            }
        }
    }, [visible, taskToEdit, form]);

    const handleSubmit = (values: any) => {
        const payload: any = {
            title: values.title,
            description: values.description,
            priority: priority || 'MEDIUM', // Default to MEDIUM if not selected
            dueDate: values.dueDate ? values.dueDate.valueOf() : undefined,
            tags: values.tags,
        };

        if (taskToEdit) {
            updateTask(taskToEdit.id, payload);
        } else {
            const newTask: Omit<Task, 'id' | 'createdAt'> = {
                ...payload,
                status: 'TODO',
            };
            addTask(newTask);
        }

        form.resetFields();
        setPriority(undefined);
        onClose();
    };

    const modalTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ color: 'var(--text-primary)' }}>{taskToEdit ? "업무 수정" : "새로운 업무"}</span>
            <div style={{ marginRight: '20px' }}>
                <Select
                    value={priority}
                    onChange={(value: Priority) => setPriority(value)}
                    placeholder="priority"
                    style={{ width: 100 }}
                    variant="borderless"
                    // @ts-ignore - fixing deprecated warning
                    className="priority-select"
                >
                    <Option value="HIGH">
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>High</span>
                    </Option>
                    <Option value="MEDIUM">
                        <span style={{ color: '#faad14', fontWeight: 'bold' }}>Medium</span>
                    </Option>
                    <Option value="LOW">
                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Low</span>
                    </Option>
                </Select>
            </div>
        </div>
    );

    return (
        <Modal
            title={modalTitle}
            open={visible}
            onCancel={onClose}
            footer={null}
            className="glass-modal"
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ title: '', description: '' }}
            >
                <Form.Item
                    name="title"
                    label={<span style={{ color: 'var(--text-primary)' }}>Title</span>}
                    rules={[{ required: true, message: 'Please enter a task title' }]}
                >
                    <Input
                        placeholder="업무명을 입력해주세요."
                        style={{
                            background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="tags"
                    label={<span style={{ color: 'var(--text-primary)' }}>Tags (Max 3)</span>}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value.length > 3) {
                                    return Promise.reject(new Error('Tags are limited to 3'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                            background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                        }}
                        placeholder="태그를 입력하세요 (최대 3개)"
                        maxCount={3}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        name="dueDate"
                        label={<span style={{ color: 'var(--text-primary)' }}>Deadline (Optional)</span>}
                        style={{ flex: 1 }}
                    >
                        <DatePicker
                            style={{
                                width: '100%',
                                background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                                border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                                color: 'var(--text-primary)'
                            }}
                            placeholder="마감일을 선택해주세요."
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label={<span style={{ color: 'var(--text-primary)' }}>Description (Optional)</span>}
                >
                    <TextArea
                        rows={4}
                        placeholder="상세 내용을 입력해주세요."
                        style={{
                            background: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8, background: 'transparent', color: 'var(--text-secondary)', border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}>
                        취소
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', border: 'none', color: '#2c3e50', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontWeight: 600 }}>
                        {taskToEdit ? "수정" : "생성"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTaskModal;

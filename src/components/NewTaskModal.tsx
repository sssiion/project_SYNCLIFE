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
                    assignee: taskToEdit.assignee,
                });
                setPriority(taskToEdit.priority);
            } else {
                form.resetFields();
                setPriority(undefined);
            }
        }
    }, [visible, taskToEdit, form]);

    const handleSubmit = (values: any) => {
        if (!priority) {
            // Using antd message to show error since Select is outside Form
            Modal.error({
                title: '필수 항목 누락',
                content: '우선순위(Priority)를 선택해주세요.',
                centered: true,
            });
            return;
        }

        const payload: any = {
            title: values.title,
            description: values.description,
            priority: priority,
            dueDate: values.dueDate ? values.dueDate.valueOf() : undefined,
            tags: values.tags,
            assignee: values.assignee
        };

        if (taskToEdit) {
            updateTask(taskToEdit.id, payload);
        } else {
            const newTask: Omit<Task, 'id' | 'createdAt'> = {
                ...payload,
                status: 'todo',
                updatedAt: Date.now(),
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
                    placeholder={
                        <span style={{ color: 'var(--text-primary)' }}>
                            <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>Priority
                        </span>
                    }
                    style={{ width: 110 }}
                    variant="borderless"
                    // @ts-ignore - fixing deprecated warning
                    className="priority-select"
                >
                    <Option value="high">
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>High</span>
                    </Option>
                    <Option value="medium">
                        <span style={{ color: '#faad14', fontWeight: 'bold' }}>Medium</span>
                    </Option>
                    <Option value="low">
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
            zIndex={2000}
            destroyOnClose={true}
            maskClosable={true}
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

                <Form.Item
                    name="assignee"
                    label={<span style={{ color: 'var(--text-primary)' }}>담당자 (Assignee)</span>}
                >
                    <Input
                        placeholder="이름을 입력해주세요"
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
                    <Button type="primary" htmlType="submit" style={{ background: 'var(--bg-gradient-sky)', border: 'none', color: '#ffffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontWeight: 600 }}>
                        {taskToEdit ? "수정" : "생성"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTaskModal;

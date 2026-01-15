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
    const [priority, setPriority] = useState<Priority>('MEDIUM');

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
                setPriority('MEDIUM');
            }
        }
    }, [visible, taskToEdit, form]);

    const handleSubmit = (values: any) => {
        const payload: any = {
            title: values.title,
            description: values.description,
            priority: priority,
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
        setPriority('MEDIUM');
        onClose();
    };

    const modalTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>{taskToEdit ? "Edit Task" : "Create New Task"}</span>
            <div style={{ marginRight: '20px' }}>
                <Select
                    value={priority}
                    onChange={(value: Priority) => setPriority(value)}
                    placeholder="Level"
                    style={{ width: 100 }}
                    // @ts-ignore - fixing deprecated warning
                    styles={{ popup: { root: { background: '#ffffff' } } }}
                    bordered={false}
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
                    label={<span style={{ color: '#2c3e50' }}>Title</span>}
                    rules={[{ required: true, message: 'Please enter a task title' }]}
                >
                    <Input placeholder="업무명을 입력해주세요." style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)', color: '#2c3e50' }} />
                </Form.Item>

                <Form.Item
                    name="tags"
                    label={<span style={{ color: '#2c3e50' }}>Tags (Max 3)</span>}
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
                        style={{ width: '100%' }}
                        placeholder="태그를 입력하세요 (최대 3개)"
                        maxCount={3}
                        // @ts-ignore
                        styles={{ selector: { background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)' } }}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        name="dueDate"
                        label={<span style={{ color: '#2c3e50' }}>Deadline (Optional)</span>}
                        style={{ flex: 1 }}
                    >
                        <DatePicker
                            style={{ width: '100%', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)' }}
                            placeholder="Select date"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label={<span style={{ color: '#2c3e50' }}>Description (Optional)</span>}
                >
                    <TextArea
                        rows={4}
                        placeholder="상세 내용을 입력해주세요."
                        style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.1)', color: '#2c3e50' }}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8, background: 'transparent', color: '#596275', border: '1px solid rgba(0,0,0,0.1)' }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', border: 'none', color: '#2c3e50', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        {taskToEdit ? "Update Task" : "Create Task"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTaskModal;

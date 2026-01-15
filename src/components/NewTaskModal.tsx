import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import type { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';

const { Option } = Select;
const { TextArea } = Input;

interface NewTaskModalProps {
    visible: boolean;
    onClose: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const addTask = useTaskStore((state) => state.addTask);

    const handleSubmit = (values: any) => {
        const newTask: Omit<Task, 'id' | 'createdAt'> = {
            title: values.title,
            description: values.description,
            priority: values.priority,
            status: 'TODO',
        };

        addTask(newTask);
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Create New Task"
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
                initialValues={{ priority: 'MEDIUM' }}
            >
                <Form.Item
                    name="title"
                    label={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Title</span>}
                    rules={[{ required: true, message: 'Please enter a task title' }]}
                >
                    <Input placeholder="What needs to be done?" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Description (Optional)</span>}
                >
                    <TextArea
                        rows={4}
                        placeholder="Add details..."
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                    />
                </Form.Item>

                <Form.Item
                    name="priority"
                    label={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Priority</span>}
                >
                    <Select style={{ background: 'transparent' }} dropdownStyle={{ background: '#2a2a2a' }}>
                        <Option value="HIGH">High</Option>
                        <Option value="MEDIUM">Medium</Option>
                        <Option value="LOW">Low</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: 8, background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                        Create Task
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTaskModal;

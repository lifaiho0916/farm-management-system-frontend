import React, { useState } from 'react'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from "antd";
import AuthService from 'services/AuthService';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const rules = {
    email: [
        {
            required: true,
            message: 'Please input your email address'
        },
        {
            type: 'email',
            message: 'Please enter a validate email!'
        }
    ],
    name: [
        {
            required: true,
            message: 'Please input your Full Name'
        },
        () => ({
            validator(_, value) {
                if (value.length === 0 || value.length >= 4) {
                    return Promise.resolve();
                }
                return Promise.reject('Minimum 4 characters');
            },
        })
    ],
    password: [
        {
            required: true,
            message: 'Please input your password'
        },
        () => ({
            validator(_, value) {
                if (value.length === 0 || value.length >= 6) {
                    return Promise.resolve();
                }
                return Promise.reject('Minimum 6 characters');
            },
        })
    ],
    confirm: [
        {
            required: true,
            message: 'Please confirm your password!'
        },
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject('Passwords do not match!');
            },
        })
    ]
}

export const RegisterForm = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const onSignUp = () => {
        form.validateFields().then(values => {
            SignUp(values);
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    }

    const SignUp = async (values) => {
        const { email, password, name } = values
        setIsLoading(true)
        const res = await AuthService.register({ email, password, name })
        setIsLoading(false)
        if (res?.success) {
            notification.success({ message: res.message })
            navigate('/auth/login')
        }
    }

    return (
        <Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
            <Form.Item
                name="email"
                label="Email"
                rules={rules.email}
                hasFeedback
            >
                <Input prefix={<MailOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item
                name="name"
                label="Full Name"
                rules={rules.name}
                hasFeedback
            >
                <Input prefix={<UserOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={rules.password}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="ConfirmPassword"
                rules={rules.confirm}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isLoading}>
                    Sign Up
                </Button>
            </Form.Item>
        </Form>
    )
}

export default RegisterForm

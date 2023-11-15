import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from "antd";
import { showLoading, hideLoading, hideAuthMessage } from 'store/slices/authSlice';
import AuthService from 'services/AuthService';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"

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
        }
    ],
    password: [
        {
            required: true,
            message: 'Please input your password'
        }
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
    const { showMessage, loading, message } = useSelector((state) => state.auth)
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSignUp = () => {
        form.validateFields().then(values => {
            SignUp(values)
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    }

    const SignUp = async (values) => {
            const { email, password, name } = values
            dispatch(showLoading())
            await AuthService.register({ email, password, name } ,navigate)
            dispatch(hideLoading())
    }

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => hideAuthMessage(), 3000)
            return () => {
                clearTimeout(timer);
            };
        }
    });

    return (
        <>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0
                }}>
                <Alert type="error" showIcon message={message}></Alert>
            </motion.div>
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
                    <Input />
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
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default RegisterForm

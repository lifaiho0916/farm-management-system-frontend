import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthService from 'services/AuthService';
import { useDispatch } from 'react-redux';
import { signInSuccess } from 'store/slices/authSlice';
import { notification } from 'antd';

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onLogin = async (values) => {
        const { email, password } = values
        setIsLoading(true)
        const res = await AuthService.login({ usernameOrEmail: email, password: password })
        setIsLoading(false)
        if (res?.accessToken) {
            dispatch(signInSuccess(res?.accessToken))
            notification.success({ message: 'Successfully logged in!' })
            navigate(redirect ? redirect : '/')
        }
        setIsForgotPassword(true)
    };

    const onForgetPasswordClick = () => {
        navigate('/auth/forgot-password')
    }

    return (
        <Form
            layout="vertical"
            name="login-form"
            onFinish={onLogin}
        >
            <Form.Item
                name="email"
                label="Email"
                rules={[
                    {
                        required: true,
                        message: 'Please input your email',
                    },
                    {
                        type: 'email',
                        message: 'Please enter a validate email!'
                    }
                ]}>
                <Input prefix={<MailOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item
                name="password"
                label={
                    <div
                        className={`${isForgotPassword ? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
                        <span>Password</span>
                        {
                            isForgotPassword &&
                            <span
                                onClick={onForgetPasswordClick}
                                className="cursor-pointer font-size-sm font-weight-normal text-muted"
                            >
                                Forget Password?
                            </span>
                        }
                    </div>
                }
                rules={[
                    {
                        required: true,
                        message: 'Please input your password',
                    }
                ]}
            >
                <Input.Password prefix={<LockOutlined className="text-primary" />} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block loading={isLoading}>
                    Sign In
                </Button>
            </Form.Item>
        </Form>
    )
}

export default LoginForm

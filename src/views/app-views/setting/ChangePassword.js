import React, { useState, useRef } from 'react'
import { Form, Button, Input, Row, Col, message } from 'antd';
import AuthService from 'services/AuthService';

const ChangePassword = () => {
	const changePasswordFormRef = useRef(null)
	const [isLoading, setIsLoading] = useState(false)

	const onFinish = async (values) => {
		const { currentPassword, newPassword } = values;
		setIsLoading(true)
		const res = await AuthService.changePassword({ oldPassword: currentPassword, newPassword: newPassword })
		if (res) {
			message.success({ content: 'Password Changed!', duration: 2.5 });
		}
		setIsLoading(false)
		onReset()
	};

	const onReset = () => {
		if (changePasswordFormRef) {
			changePasswordFormRef.current.resetFields()
		}
	};

	return (
		<>
			<h2 className="mb-4">Change Password</h2>
			<Row >
				<Col xs={24} sm={24} md={24} lg={8}>
					<Form
						name="changePasswordForm"
						layout="vertical"
						ref={changePasswordFormRef}
						onFinish={onFinish}
					>
						<Form.Item
							label="Current Password"
							name="currentPassword"
							rules={[{
								required: true,
								message: 'Please enter your currrent password!'
							}]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							label="New Password"
							name="newPassword"
							rules={[{
								required: true,
								message: 'Please enter your new password!'
							},
							() => ({
								validator(_, value) {
									if (value.length === 0 || value.length >= 6) {
										return Promise.resolve();
									}
									return Promise.reject('Minimum 6 characters');
								},
							})]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							label="Confirm Password"
							name="confirmPassword"
							rules={
								[
									{
										required: true,
										message: 'Please confirm your password!'
									},
									({ getFieldValue }) => ({
										validator(rule, value) {
											if (!value || getFieldValue('newPassword') === value) {
												return Promise.resolve();
											}
											return Promise.reject('Password not matched!');
										},
									}),
								]
							}
						>
							<Input.Password />
						</Form.Item>
						<Button type="primary" htmlType="submit" loading={isLoading}>
							Change password
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	)
}

export default ChangePassword

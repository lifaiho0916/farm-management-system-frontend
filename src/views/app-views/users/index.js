import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, notification } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import UserService from 'services/UserService';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from 'store/slices/userSlice';
import { setFarms } from 'store/slices/farmSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const UserList = () => {
    const { user } = useSelector(state => state.auth)
    const { users } = useSelector(state => state.user)
    const { farms } = useSelector(state => state.farm)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setSelectedUser(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedUser(users.filter(user => user.id === id)[0])
        setIsModalOpen(true);
        setMode(false);
    }

    const DeleteBtnClick = (id) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete?',
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    try {
                        const res = await UserService.deleteUser(id);
                        if (res) {
                            notification.success({ message: 'User deleted successfully' });
                            const filtered = users.filter((user) => user.id !== id);
                            dispatch(setUsers(filtered));
                            resolve();
                        } else {
                            reject();
                        }
                    } catch (error) {
                        console.log('Oops errors!');
                        reject();
                    }
                });
            },
        });
    }

    const AddUser = async (values) => {
        setIsLoading(true)
        const res = await UserService.createUser(values);
        if (res) {
            notification.success({ message: "User created successfully" });
            dispatch(setUsers([...users, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditUser = async (values) => {
        setIsLoading(true)
        const res = await UserService.updateUser(selectedUser.id, values);
        if (res) {
            notification.success({ message: "User updated successfully" });
            const updatedUsers = users.map((user) => {
                if (user.id === selectedUser.id) return res;
                else return user
            })
            dispatch(setUsers(updatedUsers))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getUsers = async () => {
        const res = await UserService.getUsersByAdmin(user.id)
        if (res) {
            dispatch(setUsers(res))
        }
    }

    const getFarms = async () => {
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    useEffect(() => {
        if (user) {
            getUsers()
            getFarms()
        }
    }, [user])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: name => (
                <span>{name}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.name.toLowerCase();
                    b = b.name.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            render: email => (
                <span>{email}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.email.toLowerCase();
                    b = b.email.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: phone => (
                <span>{phone}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.phone.toLowerCase();
                    b = b.phone.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: address => (
                <span>{address}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.address.toLowerCase();
                    b = b.address.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'City',
            dataIndex: 'city',
            render: city => (
                <span>{city}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.city.toLowerCase();
                    b = b.city.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Zip Code',
            dataIndex: 'zipcode',
            render: zipcode => (
                <span>{zipcode}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.zipcode.toLowerCase();
                    b = b.zipcode.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Doc',
            dataIndex: 'doc',
            render: doc => (
                <span>{doc}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.doc.toLowerCase();
                    b = b.doc.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Farm',
            dataIndex: 'Fram',
            render: () => (
                <span></span>
            )
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="View">
                        <Button className="mr-2" icon={<EditOutlined />} onClick={() => EditBtnClick(elm.id)} size="small" />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button icon={<DeleteOutlined />} onClick={() => DeleteBtnClick(elm.id)} size="small" />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <>
            <Card bodyStyle={{ 'padding': '10px' }}>
                <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                    Add User
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={users} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add User' : 'Edit User'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddUser : EditUser}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please input valid email!' }]}
                            initialValue={selectedUser?.email}
                        >
                            <Input readOnly={!mode} defaultValue={selectedUser?.email} />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={mode ? [{ required: true, message: 'Please input your password!' }, () => ({
                                validator(_, value) {
                                    if (value.length === 0 || value.length >= 6) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Minimum 6 characters');
                                },
                            })] : []}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your full name!' }, () => ({
                                validator(_, value) {
                                    if (value.length === 0 || value.length >= 4) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Minimum 4 characters');
                                },
                            })]}
                            initialValue={selectedUser?.name}
                        >
                            <Input defaultValue={selectedUser?.name} />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input defaultValue={selectedUser?.phone} />
                        </Form.Item>

                        <Form.Item
                            label="Doc"
                            name="doc"
                        >
                            <Input defaultValue={selectedUser?.doc} />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input defaultValue={selectedUser?.address} />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                        >
                            <Input defaultValue={selectedUser?.city} />
                        </Form.Item>

                        <Form.Item
                            label="Zip Code"
                            name="zipcode"
                        >
                            <Input defaultValue={selectedUser?.zipcode} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            }
        </>
    )
}

export default UserList

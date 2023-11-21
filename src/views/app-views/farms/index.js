import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, notification } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import FarmService from 'services/FarmService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarms } from 'store/slices/farmSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const FarmList = () => {
    const { user } = useSelector(state => state.auth)
    const { farms } = useSelector(state => state.farm)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedFarm, setSelectedFarm] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setSelectedFarm(null)
        setIsModalOpen(true);
        setMode(true);
    };

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
                        const res = await FarmService.deleteFarm(id);
                        if (res) {
                            notification.success({ message: 'Farm deleted successfully' });
                            const filtered = farms.filter((farm) => farm.id !== id);
                            dispatch(setFarms(filtered));
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

    const EditBtnClick = (id) => {
        setSelectedFarm(farms.filter(farm => farm.id === id)[0])
        setIsModalOpen(true);
        setMode(false);
    }

    const AddFarm = async (values) => {
        setIsLoading(true)
        const res = await FarmService.createFarm(values);
        if (res) {
            notification.success({ message: "Farm created successfully" });
            dispatch(setFarms([...farms, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditFarm = async (values) => {
        setIsLoading(true)
        const res = await FarmService.updateFarm(selectedFarm.id, values);
        if (res) {
            notification.success({ message: "Farm updated successfully" });
            const updatedFarms = farms.map((farm) => {
                if (farm.id === selectedFarm.id) return res;
                else return farm
            })
            dispatch(setFarms(updatedFarms))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    useEffect(() => {
        if (user) {
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
            title: 'Description',
            dataIndex: 'description',
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
            title: 'State',
            dataIndex: 'state',
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
                    Add Farm
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={farms} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Farm' : 'Edit Farm'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddFarm : EditFarm}
                    >

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                            initialValue={selectedFarm?.description}
                        >
                            <Input.TextArea defaultValue={selectedFarm?.description} />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            initialValue={selectedFarm?.address}
                        >
                            <Input defaultValue={selectedFarm?.address} />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                            initialValue={selectedFarm?.city}
                        >
                            <Input defaultValue={selectedFarm?.city} />
                        </Form.Item>

                        <Form.Item
                            label="State"
                            name="state"
                            initalValue={selectedFarm?.state}
                        >
                            <Input defaultValue={selectedFarm?.state} />
                        </Form.Item>

                        <Form.Item
                            label="Zip Code"
                            name="zipcode"
                            initialValue={selectedFarm?.zipcode}
                        >
                            <Input defaultValue={selectedFarm?.zipcode} />
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

export default FarmList

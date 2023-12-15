import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import PayMethodService from 'services/PayMethodService';
import { useSelector, useDispatch } from 'react-redux';
import { setPayMethods } from 'store/slices/payMethodSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const PayMethodList = () => {
    const { user } = useSelector(state => state.auth)
    const { payMethods } = useSelector(state => state.payMethod)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedPayMethod, setSelectedPayMethod] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setSelectedPayMethod(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedPayMethod(payMethods.filter(payMethod => payMethod.id === id)[0])
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
                        const res = await PayMethodService.deletePayMethod(id);
                        if (res) {
                            message.success({ content: 'Pay Method deleted successfully', duration: 2.5 });
                            const filtered = payMethods.filter((payMethod) => payMethod.id !== id);
                            dispatch(setPayMethods(filtered));
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

    const AddPayMethod = async (values) => {
        setIsLoading(true)
        const res = await PayMethodService.createPayMethod(values);
        if (res) {
            message.success({ content: "Pay Method created successfully", duration: 2.5 });
            dispatch(setPayMethods([...payMethods, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditPayMethod = async (values) => {
        setIsLoading(true)
        const res = await PayMethodService.updatePayMethod(selectedPayMethod.id, values);
        if (res) {
            message.success({ content: "PayMethod updated successfully", duration: 2.5 });
            const updatedPayMethods = payMethods.map((payMethod) => {
                if (payMethod.id === selectedPayMethod.id) return res;
                else return payMethod
            })
            dispatch(setPayMethods(updatedPayMethods))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getPayMethods = async () => {
        dispatch(setPayMethods([]))
        const res = await PayMethodService.getAllPayMethod()
        if (res) {
            dispatch(setPayMethods(res))
        }
    }


    useEffect(() => {
        if (user) {
            getPayMethods()
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
            title: 'PayMethod',
            dataIndex: 'description',
            render: description => (
                <span>{description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.description.toLowerCase();
                    b = b.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-right d-flex justify-content-end">
                    <Tooltip title="Edit">
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
                    Add PayMethod
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={payMethods} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add PayMethod' : 'Edit PayMethod'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddPayMethod : EditPayMethod}
                    >
                        <Form.Item
                            label="PayMethod"
                            name="description"
                            rules={[{ required: true, message: 'Please input PayMethod' }]}
                            initialValue={selectedPayMethod?.description}
                        >
                            <Input defaultValue={selectedPayMethod?.description} />
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

export default PayMethodList
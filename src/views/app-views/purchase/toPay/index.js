import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ToPayService from 'services/ToPayService';
import PurchaseService from 'services/PurchaseService';
import PayMethodService from 'services/PayMethodService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setPurchase, setPurchases} from 'store/slices/purchaseSlice';
import { setToPays } from 'store/slices/toPaySlice';
import { setPayMethod, setPayMethods } from 'store/slices/payMethodSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const ToPayList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { purchase, purchases } = useSelector(state => state.purchase)
    const { toPay, toPays } = useSelector(state => state.toPay)
    const { payMethod, payMethods } = useSelector(state => state.payMethod)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedToPay, setSelectedToPay] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    const getPayMethods = async () => {
        dispatch(setPayMethods([]))
        const res = await PayMethodService.getAllPayMethod()
        if (res) {
            dispatch(setPayMethods(res))
        }
    }

    const getPurchases = async (id) => {
        dispatch(setPurchases([]))
        const res = await PurchaseService.getPurchaseByFarm(id)
        if (res) {
            dispatch(setPurchases(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const getToPays = async (id) => {
        dispatch(setToPays([]))
        const res = await ToPayService.getToPayByPurchase(id)
        if (res) {
            dispatch(setToPays(res))
        }
    }

    const selectPayMethod = async (id) => {
        const res = await PayMethodService.getPayMethodById(id)
        if (res) {
            dispatch(setPayMethod(res))
        }
    }

    const getDate = async (val) => {
        return val.split("T")[0]
    }

    const AddBtnClick = () => {
        setSelectedToPay(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedToPay(toPays.filter(toPay => toPay.id === id)[0])
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
                        const res = await ToPayService.deletetoPay(id);
                        if (res) {
                            message.success({ content: 'Bill to receive is deleted successfully', duration: 2.5 });
                            const filtered = toPays.filter((toPay) => toPay.id !== id);
                            dispatch(setToPays(filtered));
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

    const AddToPay = async (values) => {
        setIsLoading(true)
        values.paymentMethodId = payMethod.id
        values.purchaseId = purchase.id
        const res = await ToPayService.createToPay(values);
        if (res) {
            message.success({ content: "Bill to receive is created successfully", duration: 2.5 });
            dispatch(setToPays([...toPays, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditToPay = async (values) => {
        setIsLoading(true)
        values.paymentMethodId = payMethod.id
        values.purchaseId = purchase.id
        const res = await ToPayService.updatedToPay(selectedToPay.id, values);
        if (res) {
            message.success({ content: "To Receive updated successfully", duration: 2.5 });
            const updatedToPays = toPays.map((toPay) => {
                if (toPay.id === selectedToPay.id) return res;
                else return toPay
            })
            dispatch(setToPays(updatedToPays))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (user) {
            getFarms()
            getPayMethods()
        }
    }, [user])

    useEffect(() => {
        if (farms.length > 0) {
            getPurchases(farms[0].id)
            dispatch(setFarm(farms[0]))
            dispatch(setPayMethod(payMethods[0]))
        }
    }, [farms])

    useEffect(() => {
        if (purchases.length > 0) {
            getToPays(purchases[0].id)
            dispatch(setPurchase(purchases[0]))
        }
    }, [purchases])

    useEffect(() => {
        if(farm) {
            getPurchases(farm.id)
        }
    }, [farm])

    useEffect(() => {
        if(purchase) {
            getToPays(purchase.id)
        }
    }, [purchase])

    useEffect(() => {
        if (payMethods.length > 0) {
            dispatch(setPayMethod(payMethods[0]))
        }
    }, [payMethods])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Purchase Id',
            dataIndex: 'purchase',
            render: purchase => (
                <span>{purchase.id}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.purchase.id.toLowerCase();
                    b = b.purchase.id.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            render: amount => (
                <span>{amount}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.amount.toLowerCase();
                    b = b.amount.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Paid Amount',
            dataIndex: 'amount_paid',
            render: amount_paid => (
                <span>{amount_paid}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.amount_paid.toLowerCase();
                    b = b.amount_paid.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Pay Method',
            dataIndex: 'paymentMethod',
            render: paymentMethod => (
                <span>{paymentMethod.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.paymentMethod.description.toLowerCase();
                    b = b.paymentMethod.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Installment',
            dataIndex: 'installment',
            render: installment => (
                <span>{installment}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.installment.toLowerCase();
                    b = b.installment.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Expected Date',
            dataIndex: 'expected_payment_date',
            render: expected_payment_date => (
                <span>{expected_payment_date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.expected_payment_date.toLowerCase();
                    b = b.expected_payment_date.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Received Date',
            dataIndex: 'payment_date_made',
            render: payment_date_made => (
                <span>{payment_date_made}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.payment_date_made.toLowerCase();
                    b = b.payment_date_made.toLowerCase();
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
                <label>Farms:&nbsp;&nbsp;</label>
                {farms.length > 0 &&
                    <Select onChange={(value) => { getPurchases(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {purchases.length > 0 &&
                <label><br></br>Purchase Id:&nbsp;&nbsp;</label>
                }
                {purchases.length > 0 && 
                    <Select onChange={(value) => { getToPays(value) }} defaultValue={farms[0].id}>
                        {purchases.map((Purchase, index) => (
                            <Option key={index} value={Purchase.id}>{Purchase.id}</Option>
                        ))}
                    </Select>
                }
                {purchases.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={toPays} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add' : 'Edit'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddToPay : EditToPay}
                    >

                        <Form.Item
                            label="Amount"
                            name="amount"
                            initialValue={selectedToPay?.amount}
                            rules={[{ required: true, message: 'Amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Method"
                        >
                            <Select defaultValue={mode ? payMethods[0].id : selectedToPay?.paymentMethod.id} onChange={(value) => selectPayMethod(value)}>
                                {payMethods.map((payMethod, index) => (
                                    <Option key={index + 1} value={payMethod.id}>{payMethod.description}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Received Amount"
                            name="amount_paid"
                            initialValue={selectedToPay?.amount_paid}
                            rules={[{ required: true, message: 'Received amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Expected"
                                name="expected_payment_date"
                                rules={[{ required: true, message: 'Expected date is required' }]}
                            >
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        }

                        {mode &&
                            <Form.Item
                                label="Installment"
                                name="installment"
                                initialValue={selectedToPay?.installment}
                                rules={[{ required: true, message: 'Installment is required' }]}
                            >
                                <Input />
                            </Form.Item>
                        }

                        {mode &&
                            <Form.Item
                                label="Received"
                                name="payment_date_made"
                                rules={[{ required: true, message: 'Expected date is required' }]}
                            >
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        }
                        
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

export default ToPayList
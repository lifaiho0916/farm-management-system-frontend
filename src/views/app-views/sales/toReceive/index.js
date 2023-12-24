import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import ToReceiveService from 'services/ToReceiveService';
import ProductSaleService from 'services/ProductSaleService';
import PayMethodService from 'services/PayMethodService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setProductSale, setProductSales} from 'store/slices/productSaleSlice';
import { setToReceives } from 'store/slices/toReceiveSlice';
import { setPayMethod, setPayMethods } from 'store/slices/payMethodSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const ToReceiveList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { productSale, productSales } = useSelector(state => state.productSale)
    const { toReceives } = useSelector(state => state.toReceive)
    const { payMethod, payMethods } = useSelector(state => state.payMethod)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedToReceive, setSelectedToReceive] = useState(null)

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

    const getProductSales = async (id) => {
        dispatch(setProductSales([]))
        dispatch(setToReceives([]))
        const res = await ProductSaleService.getProductSalesByFarm(id)
        if (res) {
            dispatch(setProductSales(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const getToReceives = async (id) => {
        dispatch(setToReceives([]))
        const res = await ToReceiveService.getToReceiveBySale(id)
        if (res) {
            dispatch(setToReceives(res))
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
        setSelectedToReceive(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedToReceive(toReceives.filter(toReceive => toReceive.id === id)[0])
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
                        const res = await ToReceiveService.deleteToReceive(id);
                        if (res) {
                            message.success({ content: 'Bill to receive is deleted successfully', duration: 2.5 });
                            const filtered = toReceives.filter((ToReceive) => ToReceive.id !== id);
                            dispatch(setToReceives(filtered));
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

    const AddToReceive = async (values) => {
        setIsLoading(true)
        values.paymentMethodId = payMethod.id
        values.productSaleId = productSale.id
        const res = await ToReceiveService.createToReceive(values);
        if (res) {
            message.success({ content: "Bill to receive is created successfully", duration: 2.5 });
            dispatch(setToReceives([...toReceives, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditToReceive = async (values) => {
        setIsLoading(true)
        values.paymentMethodId = payMethod.id
        values.productSaleId = productSale.id
        const res = await ToReceiveService.updatedToReceive(selectedToReceive.id, values);
        if (res) {
            message.success({ content: "To Receive updated successfully", duration: 2.5 });
            const updatedToReceives = toReceives.map((toReceive) => {
                if (toReceive.id === selectedToReceive.id) return res;
                else return toReceive
            })
            dispatch(setToReceives(updatedToReceives))
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
            getProductSales(farms[0].id)
            dispatch(setFarm(farms[0]))
            dispatch(setPayMethod(payMethods[0]))
        }
    }, [farms])

    useEffect(() => {
        if (productSales.length > 0) {
            getToReceives(productSales[0].id)
            dispatch(setProductSale(productSales[0]))
        }
    }, [productSales])

    useEffect(() => {
        if(farm) {
            getProductSales(farm.id)
        }
    }, [farm])

    useEffect(() => {
        if(productSale) {
            getToReceives(productSale.id)
        }
    }, [productSale])

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
            title: 'Sale Id',
            dataIndex: 'productionSale',
            render: productionSale => (
                <span>{productionSale.id}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.productionSale.id.toLowerCase();
                    b = b.productionSale.id.toLowerCase();
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
            title: 'Received Amount',
            dataIndex: 'amount_received',
            render: amount_received => (
                <span>{amount_received}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.amount_received.toLowerCase();
                    b = b.amount_received.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Expected Date',
            dataIndex: 'expected_receive_date',
            render: expected_receive_date => (
                <span>{expected_receive_date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.expected_receive_date.toLowerCase();
                    b = b.expected_receive_date.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Received Date',
            dataIndex: 'receive_date_made',
            render: receive_date_made => (
                <span>{receive_date_made}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.receive_date_made.toLowerCase();
                    b = b.receive_date_made.toLowerCase();
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
            <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={24}>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                            <StatisticWidget 
                                title="Farm" 
                                value={farm ? String(farm.description) : String('')}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                            <StatisticWidget 
                                title="Sale Id" 
                                value={productSale ? String(productSale.id) : String('')}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                            <StatisticWidget 
                                title= "Total Installment" 
                                value={productSale ? String(productSale.total_installment) : String('')}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6}>
                            <StatisticWidget 
                                title= "Amount Money" 
                                value={productSale ? String(productSale.amount_money) : String('')}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Card bodyStyle={{ 'padding': '10px' }}>
                <label>Farms:&nbsp;&nbsp;</label>
                {farms.length > 0 &&
                    <Select onChange={(value) => { getProductSales(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                <label><br></br>Sale Id:&nbsp;&nbsp;</label>
                {productSales.length > 0 && 
                    <Select onChange={(value) => { getToReceives(value) }} defaultValue={farms[0].id}>
                        {productSales.map((productSale, index) => (
                            <Option key={index} value={productSale.id}>{productSale.id}</Option>
                        ))}
                    </Select>
                }
                {productSales.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={toReceives} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add' : 'Edit'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddToReceive : EditToReceive}
                    >

                        <Form.Item
                            label="Amount"
                            name="amount"
                            initialValue={selectedToReceive?.amount}
                            rules={[{ required: true, message: 'Amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Method"
                        >
                            {payMethods.length > 0 &&
                            <Select defaultValue={mode ? payMethods[0].id : selectedToReceive?.paymentMethod.id} onChange={(value) => selectPayMethod(value)}>
                                {payMethods.map((payMethod, index) => (
                                    <Option key={index + 1} value={payMethod.id}>{payMethod.description}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Received Amount"
                            name="amount_received"
                            initialValue={selectedToReceive?.amount_received}
                            rules={[{ required: true, message: 'Received amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Expected"
                                name="expected_receive_date"
                                rules={[{ required: true, message: 'Expected date is required' }]}
                            >
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        }

                        {mode &&
                            <Form.Item
                                label="Installment"
                                name="installment"
                                initialValue={selectedToReceive?.installment}
                                rules={[{ required: true, message: 'Installment is required' }]}
                            >
                                <Input />
                            </Form.Item>
                        }

                        {mode &&
                            <Form.Item
                                label="Received"
                                name="receive_date_made"
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

export default ToReceiveList
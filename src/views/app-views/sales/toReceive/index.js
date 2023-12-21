import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ToReceiveService from 'services/ToReceiveService';
import ProductSaleService from 'services/ProductSaleService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setProductSale, setProductSales} from 'store/slices/productSaleSlice';
import { setToReceives } from 'store/slices/toReceiveSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const ToReceiveList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { productSale, productSales } = useSelector(state => state.productSale)
    const { toReceive, toReceives } = useSelector(state => state.toReceive)
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

    const getProductSales = async (id) => {
        dispatch(setProductSales([]))
        const res = await ProductSaleService.getProductSalesByFarm(id)
        if (res) {
            dispatch(setToReceives(res))
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
        values.farmId = farm.id
        values.year = values.date.$y
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
        const res = await ToReceiveService.updatedToReceive(selectedToReceive.id, values);
        if (res) {
            message.success({ content: "To Receive updated successfully", duration: 2.5 });
            const updatedToReceives = toReceive.map((toReceive) => {
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
        }
    }, [user])

    useEffect(() => {
        if (farms.length > 0) {
            getProductSales(farms[0].id)
            dispatch(setFarm(farms[0]))
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

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
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
                    <Select onChange={(value) => { getProductSales(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {farms.length > 0 && 
                    <>
                    {productSales.length > 0 &&
                        <Select onChange={(value) => { getToReceives(value) }} defaultValue={farms[0].id}>
                            {productSales.map((productSale, index) => (
                                <Option key={index} value={productSale.id}>{productSale.id}</Option>
                            ))}
                        </Select>
                    }
                    </>
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
                            label="Received Amount"
                            name="amount_receive"
                            initialValue={selectedToReceive?.amount_receive}
                            rules={[{ required: true, message: 'Received amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Date"
                            name="receive_date_made"
                            initialValue={selectedToReceive?.payment_date}
                            rules={[{ required: true, message: 'Date is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Installment"
                            name="total_installment"
                            initialValue={selectedToReceive?.total_installment}
                            rules={[{ required: true, message: 'Installment is required' }]}
                        >
                            <Input />
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

export default ToReceiveList
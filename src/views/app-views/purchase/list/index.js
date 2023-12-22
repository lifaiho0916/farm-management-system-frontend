import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import PurchaseService from 'services/PurchaseService';
import SupplierService from 'services/SupplierService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setSupplier, setSuppliers } from 'store/slices/supplierSlice';
import { setPurchases } from 'store/slices/purchaseSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const PurchaseList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { supplier, suppliers } = useSelector(state => state.supplier)
    const { purchases } = useSelector(state => state.purchase)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedPurchase, setSelectedPurchase] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
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

    const getSuppliers = async (id) => {
        dispatch(setSuppliers([]))
        const res = await SupplierService.getSuppliersByFarm(id)
        if (res) {
            dispatch(setSuppliers(res))
        }
    }

    const selectSupplier = async (id) => {
        const res = await SupplierService.getSupplierById(id)
        if (res) {
            dispatch(setSupplier(res))
        }
    }

    const AddBtnClick = () => {
        setSelectedPurchase(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedPurchase(purchases.filter(Purchase => Purchase.id === id)[0])
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
                        const res = await PurchaseService.deletePurchase(id);
                        if (res) {
                            message.success({ content: 'Purchase deleted successfully', duration: 2.5 });
                            const filtered = purchases.filter((Purchase) => Purchase.id !== id);
                            dispatch(setPurchases(filtered));
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

    const AddPurchase = async (values) => {
        values.farmId = farm.id
        values.supplierId = supplier.id
        console.log(values)
        setIsLoading(true)
        const res = await PurchaseService.createPurchase({ ...values, farmId: farm.id });
        if (res) {
            message.success({ content: "Purchase created successfully", duration: 2.5 });
            dispatch(setPurchases([...purchases, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditPurchase = async (values) => {
        values.farmId = farm.id
        values.supplierId = supplier.id
        setIsLoading(true)
        const res = await PurchaseService.updatePurchase(selectedPurchase.id, values);
        if (res) {
            message.success({ content: "Purchase updated successfully", duration: 2.5 });
            const updatedPurchases = purchases.map((Purchase) => {
                if (Purchase.id === selectedPurchase.id) return res;
                else return Purchase
            })
            dispatch(setPurchases(updatedPurchases))
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
        if (farms.length > 0) dispatch(setFarm(farms[0]));
    }, [farms])

    useEffect(() => {
        if(farm) {
            getPurchases(farm.id)
            getSuppliers(farm.id)
        }
    }, [farm])

    useEffect(() => {
        if (suppliers.length > 0) dispatch(setSupplier(suppliers[0]));
    }, [suppliers])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            render: supplier => (
                <span>{supplier.name}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.supplier.name.toLowerCase();
                    b = b.supplier.name.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            render: totalPrice => (
                <span>{totalPrice}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.totalPrice.toLowerCase();
                    b = b.totalPrice.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Total Installment',
            dataIndex: 'totalInstallment',
            render: totalInstallment => (
                <span>{totalInstallment}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.totalInstallment.toLowerCase();
                    b = b.totalInstallment.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: date => (
                <span>{date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.date.toLowerCase();
                    b = b.date.toLowerCase();
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
                {farms.length > 0 &&
                    <Select onChange={(value) => { getPurchases(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {farms.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add Purchase
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={purchases} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Purchase' : 'Edit Purchase'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddPurchase : EditPurchase}
                    >

                        <Form.Item
                            label="Supplier"
                        >
                            <Select defaultValue={mode ? suppliers[0].id : selectedPurchase?.supplier.id} onChange={(value) => selectSupplier(value)}>
                                {suppliers.map((supplier, index) => (
                                    <Option key={index + 1} value={supplier.id}>{supplier.name}, {supplier.email}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Total Price"
                            name="totalPrice"
                            rules={[{ required: true, message: 'Please input total price' }]}
                            initialValue={selectedPurchase?.totalPrice}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Total Installment"
                            name="totalInstallment"
                            initialValue={selectedPurchase?.totalInstallment}
                        >
                            <Input />
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Purchase Date"
                                name="date"
                                rules={[{ required: true, message: 'Purchase date is required' }]}
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

export default PurchaseList
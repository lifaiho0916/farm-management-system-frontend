import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import PurchaseService from 'services/PurchaseService';
import ProductService from 'services/ProductService';
import UnitService from 'services/UnitService';
import SupplierService from 'services/SupplierService';
import FarmService from 'services/FarmService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setProduct, setProducts } from 'store/slices/productSlice';
import { setSupplier, setSuppliers } from 'store/slices/supplierSlice';
import { setUnit, setUnits } from 'store/slices/unitSlice';
import { setPurchases } from 'store/slices/purchaseSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const PurchaseList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { product, products } = useSelector(state => state.product)
    const { supplier, suppliers } = useSelector(state => state.supplier)
    const { unit, units } = useSelector(state => state.unit)
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

    const getProducts = async () => {
        dispatch(setProducts([]))
        const res = await ProductService.getAllProduct()
        if (res) {
            dispatch(setProducts(res))
        }
    }

    const getUnits = async () => {
        dispatch(setUnits([]))
        const res = await UnitService.getAllUnit()
        if (res) {
            dispatch(setUnits(res))
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

    const getSuppliers= async (id) => {
        dispatch(setSuppliers([]))
        const res = await SupplierService.getSuppliersByFarm(id)
        if (res) {
            dispatch(setSuppliers(res))
        }
    }
    
    const selectProduct = async (id) => {
        const res = await ProductService.getProductById(id)
        if (res) {
            dispatch(setProduct(res))
        }
    }
    
    const selectUnit = async (id) => {
        const res = await UnitService.getUnitById(id)
        if (res) {
            dispatch(setUnit(res))
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
        setSelectedPurchase(purchases.filter(purchase => purchase.id === id)[0])
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
                            const filtered = purchases.filter((purchase) => purchase.id !== id);
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
        values.productId = product.id
        values.supplierId = supplier.id
        values.unitId = unit.id
        values.purchaseId = 0
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
        values.productId = product.id
        values.supplierId = supplier.id
        values.unitId = unit.id
        values.purchaseId = selectedPurchase.purchase.id
        setIsLoading(true)
        const res = await PurchaseService.updatePurchase(selectedPurchase.id, values);
        if (res) {
            message.success({ content: "Purchase updated successfully", duration: 2.5 });
            const updatedPurchases = purchases.map((purchase) => {
                if (purchase.id === selectedPurchase.id) return res;
                else return purchase
            })
            dispatch(setPurchases(updatedPurchases))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (user) {
            getFarms()
            getProducts()
            getUnits()
        }
    }, [user])

    useEffect(() => {
        if (farms.length > 0) {
            dispatch(setFarm(farms[0]))
        }
    }, [farms])

    useEffect(() => {
        if(farm) { 
            getPurchases(farm.id)
            getSuppliers(farm.id)
        }
    }, [farm])
    
    useEffect(() => {
        if (products.length > 0) dispatch(setProduct(products[0]));
    }, [products])
    
    useEffect(() => {
        if (units.length > 0) dispatch(setUnit(units[0]));
    }, [units])
    
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
            title: 'Category',
            dataIndex: 'product',
            render: product => (
                <span>{product.category.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.product.category.description.toLowerCase();
                    b = b.product.category.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Product',
            dataIndex: 'product',
            render: product => (
                <span>{product.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.product.description.toLowerCase();
                    b = b.product.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            render: unit => (
                <span>{unit.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.unit.description.toLowerCase();
                    b = b.unit.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Type',
            dataIndex: 'unit',
            render: unit => (
                <span>{unit.type}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.unit.type.toLowerCase();
                    b = b.unit.type.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: quantity => (
                <span>{quantity}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.quantity.toLowerCase();
                    b = b.quantity.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Supplier',
            dataIndex: 'purchase',
            render: purchase => (
                <span>{purchase.supplier.name}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.purchase.supplier.name.toLowerCase();
                    b = b.purchase.supplier.name.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Total Price;',
            dataIndex: 'purchase',
            render: purchase => (
                <span>{purchase.totalPrice}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.purchase.totalPrice.toLowerCase();
                    b = b.purchase.totalPrice.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Installment',
            dataIndex: 'purchase',
            render: purchase => (
                <span>{purchase.totalInstallment}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.purchase.totalInstallment.toLowerCase();
                    b = b.purchase.totalInstallment.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Lote',
            dataIndex: 'lote',
            render: lote => (
                <span>{lote}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.lote.toLowerCase();
                    b = b.lote.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: price => (
                <span>{price}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.price.toLowerCase();
                    b = b.price.toLowerCase();
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
                <Modal title={mode ? 'Add Purchase' : 'Edit Plot'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddPurchase : EditPurchase}
                    >

                        <Form.Item
                            label="Product"
                        >
                            <Select defaultValue={mode ? products[0].id : selectedPurchase?.product.id} onChange={(value) => selectProduct(value)}>
                                {products.map((product, index) => (
                                    <Option key={index + 1} value={product.id}>{product.description}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Supplier"
                        >
                            <Select defaultValue={mode ? suppliers[0].id : selectedPurchase?.purchase.supplier.id} onChange={(value) => selectSupplier(value)}>
                                {suppliers.map((supplier, index) => (
                                    <Option key={index + 1} value={supplier.id}>{supplier.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Unit"
                        >
                            <Select defaultValue={mode ? units[0].id : selectedPurchase?.unit.id} onChange={(value) => selectUnit(value)}>
                                {units.map((unit, index) => (
                                    <Option key={index + 1} value={unit.id}>{unit.description} {unit.type}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {mode &&
                        <Form.Item
                            label="Date"
                            name="purchase"
                            rules={[{ required: true, message: 'Please input date' }]}
                            initialValue={selectedPurchase?.purchase.date}
                        >
                            <DatePicker format={dateFormat} />
                        </Form.Item>
                        }

                        <Form.Item
                            label="Total Price"
                            name="totalPrice"
                            rules={[{ required: true, message: 'Please input total price' }]}
                            initialValue={selectedPurchase?.purchase.totalPrice}
                        >
                            <Input defaultValue={selectedPurchase?.purchase.totalPrice} />
                        </Form.Item>

                        <Form.Item
                            label="Installment"
                            name="totalInstallment"
                            rules={[{ required: true, message: 'Please input total installment' }]}
                            initialValue={selectedPurchase?.purchase.totalInstallment}
                        >
                            <Input defaultValue={selectedPurchase?.purchase.totalInstallment} />
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please input quantity' }]}
                            initialValue={selectedPurchase?.quantity}
                        >
                            <Input defaultValue={selectedPurchase?.quantity} />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input price' }]}
                            initialValue={selectedPurchase?.price}
                        >
                            <Input defaultValue={selectedPurchase?.price} />
                        </Form.Item>

                        <Form.Item
                            label="Lote"
                            name="lote"
                            rules={[{ required: true, message: 'Crop is required' }]}
                            initialValue={selectedPurchase?.lote}
                        >
                            <Input defaultValue={selectedPurchase?.lote} />
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

export default PurchaseList
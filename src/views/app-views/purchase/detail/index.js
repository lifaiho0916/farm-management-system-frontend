import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons';
import PurchaseDetailService from 'services/PurchaseDetailService';
import FarmService from 'services/FarmService';
import PurchaseService from 'services/PurchaseService';
import ProductService from 'services/ProductService';
import UnitService from 'services/UnitService';
import SupplierService from 'services/SupplierService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setPurchase, setPurchases} from 'store/slices/purchaseSlice';
import { setPurchaseDetails } from 'store/slices/purchaseDetailSlice';
import { setProduct, setProducts } from 'store/slices/productSlice';
import { setUnit, setUnits } from 'store/slices/unitSlice';
import { setSupplier, setSuppliers } from 'store/slices/supplierSlice';
import { set } from 'lodash';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const PayDetailList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { purchase, purchases } = useSelector(state => state.purchase)
    const { supplier, suppliers } = useSelector(state => state.supplier)
    const { purchaseDetails } = useSelector(state => state.purchaseDetail)
    const { product, products } = useSelector(state => state.product)
    const { unit, units } = useSelector(state => state.unit)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedPurchaseDetail, setSelectedPurchaseDetail] = useState(null)

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

    const getSuppliers = async (id) => {
        dispatch(setSuppliers([]))
        const res = await SupplierService.getSuppliersByFarm(id)
        if (res) {
            dispatch(setSuppliers(res))
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
        dispatch(setPurchaseDetails([]))
        const res = await PurchaseService.getPurchaseByFarm(id)
        if (res) {
            dispatch(setPurchases(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const getPurchaseDetails = async (id) => {
        dispatch(setPurchaseDetails([]))
        const res = await PurchaseDetailService.getPurchaseDetailByPurchase(id)
        if (res) {
            dispatch(setPurchaseDetails(res))
            dispatch(setPurchase(purchases.filter((purchase) => purchase.id === id)[0]))
        }
    }

    const selectProduct= async (id) => {
        const res = await ProductService.getProductById(id)
        if (res) {
            dispatch(setProduct(res))
        }
    }

    const selectUnit= async (id) => {
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
        setSelectedPurchaseDetail(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedPurchaseDetail(purchaseDetails.filter(PurchaseDetail => PurchaseDetail.id === id)[0])
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
                        const res = await PurchaseDetailService.deletePurchaseDetail(id);
                        if (res) {
                            message.success({ content: 'Bill to pay is deleted successfully', duration: 2.5 });
                            const filtered = purchaseDetails.filter((PurchaseDetail) => PurchaseDetail.id !== id);
                            dispatch(setPurchaseDetails(filtered));
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

    const AddPurchaseDetail = async (values) => {
        setIsLoading(true)
        values.farmId = farm.id;
        values.supplierId = supplier.id
        values.productId = product.id
        values.purchaseId = purchase.id
        values.unitId = unit.id
        const res = await PurchaseDetailService.createPurchaseDetail(values);
        if (res) {
            message.success({ content: "Bill to pay is created successfully", duration: 2.5 });
            dispatch(setPurchaseDetails([...purchaseDetails, res]))
            dispatch(setPurchase(res.purchase))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditPurchaseDetail = async (values) => {
        setIsLoading(true)
        values.productId = product.id
        values.purchaseId = purchase.id
        values.unitId = unit.id
        const res = await PurchaseDetailService.updatePurchaseDetail(selectedPurchaseDetail.id, values);
        if (res) {
            message.success({ content: "Bill to pay updated successfully", duration: 2.5 });
            const updatedPurchaseDetails = purchaseDetails.map((PurchaseDetail) => {
                if (PurchaseDetail.id === selectedPurchaseDetail.id) return res;
                else return PurchaseDetail
            })
            dispatch(setPurchaseDetails(updatedPurchaseDetails))
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
            getPurchases(farms[0].id)
            getSuppliers(farms[0].id)
            dispatch(setFarm(farms[0]))
            dispatch(setProduct(products[0]))
            dispatch(setUnit(units[0]))
            dispatch(setSupplier(suppliers[0]))
        }
    }, [farms])

    useEffect(() => {
        if (purchases.length > 0) {
            dispatch(setPurchase(purchases[0]))
            getPurchaseDetails(purchases[0].id)
        }
    }, [purchases])

    useEffect(() => {
        if(farm) {
            getPurchases(farm.id)
        }
    }, [farm])

    useEffect(() => {
        if (products.length > 0) {
            dispatch(setProduct(products[0]))
        }
    }, [products])

    useEffect(() => {
        if (units.length > 0) {
            dispatch(setUnit(units[0]))
        }
    }, [units])

    useEffect(() => {
        if (suppliers.length > 0) {
            dispatch(setSupplier(suppliers[0]))
        }
    }, [suppliers])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Lote',
            dataIndex: 'lote',
            render: lote => (
                <span>{lote}</span>
            ),
        },
        {
            title: 'Product',
            dataIndex: 'product',
            render: product => (
                <span>{product.description}</span>
            ),
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            render: unit => (
                <span>{unit.description}, {unit.type}</span>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: price => (
                <span>{price}</span>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render: quantity => (
                <span>{quantity}</span>
            ),
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
                <div className="d-md-flex justify-content-md-between">
                    <div>
                        <h2 className="mb-1 font-weight-semibold">Purchase Detail</h2>
                        <address>
                            <label>&nbsp;&nbsp;Farms:&nbsp;&nbsp;</label>
                            {farms.length > 0 &&
                                <Select onChange={(value) => { getPurchases(value) }} defaultValue={farms[0].id}>
                                    {farms.map((farm, index) => (
                                        <Option key={index} value={farm.id}>{farm.description}</Option>
                                    ))}
                                </Select>
                            }
                            
                            <label className='mt-3'><br></br>&nbsp;&nbsp;Purchase Id:&nbsp;&nbsp;</label>
                            {purchases.length > 0 &&
                                <Select className='mt-3' onChange={(value) => { getPurchaseDetails(value) }} defaultValue = {purchases[0].id}>
                                    {purchases.map((Purchase, index) => (
                                        <Option key={index} value={Purchase.id}>Purchase {Purchase.id}</Option>
                                    ))}
                                </Select>
                            }
                        </address>
                    </div>
                </div>
                <div className="mt-4">
                    <Table columns={tableColumns} pagination={false} dataSource={purchaseDetails} rowKey='id' />
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add
                    </Button>
                    <div className="d-flex justify-content-end">
                        <div className="text-right ">
                            <h2 className="font-weight-semibold mt-3">
                                <span className="mr-1">Grand Total: ${purchase?.totalPrice}</span>
                            </h2>
                        </div>
                    </div>
                </div>
                <hr className="d-print-none"/>
                <div className="text-right d-print-none">
                    <Button type="primary" onClick={() => window.print()}>
                        <PrinterOutlined  type="printer" />
                        <span className="ml-1">Print</span>
                    </Button>
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add' : 'Edit'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddPurchaseDetail : EditPurchaseDetail}
                    >
                        
                        {purchaseDetails.length < 1 &&
                        <Form.Item label="Supplier">
                            <Select defaultValue={suppliers[0].id} onChange={(value) => selectSupplier(value)}>
                                {suppliers.map((supplier, index) => (
                                    <Option key={index + 1} value={supplier.id}>{supplier.name}, {supplier.email}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        }

                        {purchaseDetails.length < 1 &&
                        <Form.Item
                            label="Purchase Date"
                            name="date"
                            rules={[{ required: true, message: 'Purchase date is required' }]}
                        >
                            <DatePicker format={dateFormat} />
                        </Form.Item>
                        }

                        <Form.Item
                            label="Product"
                        >
                            {products.length > 0 &&
                            <Select defaultValue={mode ? products[0].id : selectedPurchaseDetail?.product.id} onChange={(value) => selectProduct(value)}>
                                {products.map((product, index) => (
                                    <Option key={index + 1} value={product.id}>{product.description}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Unit"
                        >
                            {units.length > 0 &&
                            <Select defaultValue={mode ? units[0].id : selectedPurchaseDetail?.unit.id} onChange={(value) => selectUnit(value)}>
                                {units.map((unit, index) => (
                                    <Option key={index + 1} value={unit.id}>{unit.description}, {unit.type}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            initialValue={selectedPurchaseDetail?.quantity}
                            rules={[{ required: true, message: 'Quantity is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            initialValue={selectedPurchaseDetail?.price}
                            rules={[{ required: true, message: 'Price is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Lote"
                            name="lote"
                            initialValue={selectedPurchaseDetail?.lote}
                            rules={[{ required: true, message: 'Lote is required' }]}
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

export default PayDetailList
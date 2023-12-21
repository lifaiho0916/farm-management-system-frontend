import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ProductSaleService from 'services/ProductSaleService';
import SupplierService from 'services/SupplierService';
import ProductCropService from 'services/ProductCropService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setSupplier, setSuppliers } from 'store/slices/supplierSlice';
import { setProductCrop, setProductCrops } from 'store/slices/productCropSlice';
import { setProductSale, setProductSales } from 'store/slices/productSaleSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const SaleList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { productCrop, productCrops } = useSelector(state => state.productCrop)
    const { supplier, suppliers } = useSelector(state => state.supplier)
    const { productSale, productSales } = useSelector(state => state.productSale)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedProductSale, setSelectedProductSale] = useState(null)

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
            dispatch(setProductSales(res))
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

    const getProductCrops = async (id) => {
        dispatch(setProductCrops([]))
        const res = await ProductCropService.getProductCropsByFarm(id)
        if (res) {
            dispatch(setProductCrops(res))
        }
    }

    const AddBtnClick = () => {
        setSelectedProductSale(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedProductSale(productSales.filter(productSale => productSale.id === id)[0])
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
                        const res = await ProductSaleService.deleteProductSale(id);
                        if (res) {
                            message.success({ content: 'Product Crop deleted successfully', duration: 2.5 });
                            const filtered = productSales.filter((productSale) => productSale.id !== id);
                            dispatch(setProductSales(filtered));
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

    const AddProductSale = async (values) => {
        setIsLoading(true)
        values.supplierId = supplier.id;
        values.productCropId = productCrop.id;
        const res = await ProductSaleService.createProductSale(values);
        if (res) {
            message.success({ content: "Sale created successfully", duration: 2.5 });
            dispatch(setProductSales([...productSales, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditProductSale = async (values) => {
        setIsLoading(true)
        values.supplierId = supplier.id;
        values.productCropId = productCrop.id;
        const res = await ProductSaleService.updateProductSale(selectedProductSale.id, values);
        if (res) {
            message.success({ content: "Sale updated successfully", duration: 2.5 });
            const updatedProductSales = productSales.map((ProductSale) => {
                if (ProductSale.id === selectedProductSale.id) return res;
                else return ProductSale
            })
            dispatch(setProductSales(updatedProductSales))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const selectProductCrop = async (id) => {
        const res = await ProductCropService.getProductCropById(id)
        if (res) {
            dispatch(setProductCrop(res))
        }
    }

    const selectSupplier = async (id) => {
        const res = await SupplierService.getSupplierById(id)
        if (res) {
            dispatch(setSupplier(res))
        }
    }

    useEffect(() => {
        if (user) {
            getFarms()
        }
    }, [user])

    useEffect(() => {
        if (farms.length > 0) {
            getProductSales(farms[0].id)
            getProductCrops(farms[0].id)
            getSuppliers(farms[0].id)
            dispatch(setFarm(farms[0]))
        }
    }, [farms])


    useEffect(() => {
        if(farm) {
            getProductSales(farm.id)
            getProductCrops(farm.id)
            getSuppliers(farm.id)
        }
    }, [farm])

    useEffect(() => {
        if(productCrops.length > 0) {
            dispatch(setProductCrop(productCrops[0]))
        }
    }, [productCrops])

    useEffect(() => {
        if(suppliers.length > 0) {
            dispatch(setSuppliers(suppliers[0]))
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
            title: 'Crop',
            dataIndex: 'crop',
            render: crop => (
                <span>{crop}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.crop.toLowerCase();
                    b = b.crop.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            render: supplier => (
                <span>{supplier}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.supplier.toLowerCase();
                    b = b.supplier.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Sale Date',
            dataIndex: 'sale_date',
            render: sale_date => (
                <span>{sale_date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.sale_date.toLowerCase();
                    b = b.sale_date.toLowerCase();
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
            title: 'Quotes',
            dataIndex: 'quotes',
            render: quotes => (
                <span>{quotes}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.quotes.toLowerCase();
                    b = b.quotes.toLowerCase();
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
            title: 'installment',
            dataIndex: 'installment',
            render: total_installment => (
                <span>{total_installment}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.total_installment.toLowerCase();
                    b = b.total_installment.toLowerCase();
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
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add Product Sale
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={productSales} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Product Sale' : 'Edit Product Sale'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddProductSale : EditProductSale}
                    >
                        <Form.Item
                            label="Crop"
                        >
                            <Select defaultValue={mode ? productCrops[0].id : selectedProductSale?.productCrop.id} onChange={(value) => selectProductCrop(value)}>
                                {productCrops.map((productCrop, index) => (
                                    <Option key={index + 1} value={productCrop.id}>{productCrop.crop.description}, {productCrop.crop.year}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Supplier"
                        >
                            <Select defaultValue={mode ? suppliers[0].id : selectedProductSale?.supplier.id} onChange={(value) => selectSupplier(value)}>
                                {suppliers.map((supplier, index) => (
                                    <Option key={index + 1} value={supplier.id}>{supplier.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Sale Date"
                                name="sale_date"
                                rules={[{ required: true, message: 'Sale date is required' }]}
                            >
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        }

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            initialValue={selectedProductSale?.quantity}
                            rules={[{ required: true, message: 'Quantity is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Quotes"
                            name="quotes"
                            initialValue={selectedProductSale?.quotes}
                            rules={[{ required: true, message: 'Crop is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Amount"
                            name="amount_money"
                            initialValue={selectedProductSale?.amount_money}
                            rules={[{ required: true, message: 'Amount is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Installment"
                            name="total_installment"
                            initialValue={selectedProductSale?.total_installment}
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

export default SaleList
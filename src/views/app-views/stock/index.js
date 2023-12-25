import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ProductService from 'services/ProductService';
import PurchaseService from 'services/PurchaseService';
import UnitService from 'services/UnitService';
import StockService from 'services/StockService';
import { useSelector, useDispatch } from 'react-redux';
import { setPurchase, setPurchases} from 'store/slices/purchaseSlice';
import { setStocks } from 'store/slices/stockSlice';
import { setProduct, setProducts } from 'store/slices/productSlice';
import { setUnit, setUnits } from 'store/slices/unitSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const StockList = () => {

    const { user } = useSelector(state => state.auth)
    const { purchase, purchases } = useSelector(state => state.purchase)
    const { product, products } = useSelector(state => state.product)
    const { stocks } = useSelector(state => state.stock)
    const { unit, units } = useSelector(state => state.unit)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedStock, setSelectedStock] = useState(null)

    const getStocks = async (id) => {
        dispatch(setStocks([]))
        const res = await StockService.getStocksByAdmin(id)
        if (res) {
            dispatch(setStocks(res))
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
        const res = await PurchaseService.getPurchaseByAdmin(id)
        if (res) {
            dispatch(setPurchases(res))
        }
    }

    const selectProduct = async (id) => {
        const res = await ProductService.getProductById(id)
        if (res) {
            dispatch(setProduct(res))
        }
    }

    const selectPurchase = async (id) => {
        const res = await PurchaseService.getPurchaseById(id)
        if (res) {
            dispatch(setPurchase(res))
        }
    }

    const selectUnit = async (id) => {
        const res = await UnitService.getUnitById(id)
        if (res) {
            dispatch(setUnit(res))
        }
    }

    const AddBtnClick = () => {
        setSelectedStock(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedStock(stocks.filter(Stock => Stock.id === id)[0])
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
                        const res = await StockService.deleteStock(id);
                        if (res) {
                            message.success({ content: 'Stock is deleted successfully', duration: 2.5 });
                            const filtered = stocks.filter((Stock) => Stock.id !== id);
                            dispatch(setStocks(filtered));
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

    const AddStock = async (values) => {
        setIsLoading(true)
        values.productId = product.id
        values.purchaseId = purchase.id
        values.unitId = unit.id
        const res = await StockService.createStock(values);
        if (res) {
            message.success({ content: "Stock is created successfully", duration: 2.5 });
            dispatch(setStocks([...stocks, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditStock = async (values) => {
        setIsLoading(true)
        values.productId = product.id
        values.purchaseId = purchase.id
        values.unitId = unit.id
        const res = await StockService.updateStock(selectedStock.id, values);
        if (res) {
            message.success({ content: "Stock is updated successfully", duration: 2.5 });
            const updatedStocks = stocks.map((Stock) => {
                if (Stock.id === selectedStock.id) return res;
                else return Stock
            })
            dispatch(setStocks(updatedStocks))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (user) {
            getStocks(user.id)
            getProducts()
            getPurchases(user.id)
            getUnits()
        }
    }, [user])

    useEffect(() => {
        if (purchases.length > 0) {
            dispatch(setPurchase(purchases[0]))
        }
    }, [purchases])

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
            title: 'Types',
            dataIndex: 'types',
            render: types => (
                <span>{types}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.types.toLowerCase();
                    b = b.types.toLowerCase();
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
            title: 'Moved Quantity',
            dataIndex: 'quantity_moved',
            render: quantity_moved => (
                <span>{quantity_moved}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.quantity_moved.toLowerCase();
                    b = b.quantity_moved.toLowerCase();
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
                    Add
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={stocks} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add' : 'Edit'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddStock : EditStock}
                    >

                        <Form.Item
                            label="Product"
                        >
                            {products.length > 0 &&
                            <Select defaultValue={mode ? products[0].id : selectedStock?.product.id} onChange={(value) => selectProduct(value)}>
                                {products.map((product, index) => (
                                    <Option key={index + 1} value={product.id}>{product.description}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Purchase"
                        >
                            {purchases.length > 0 &&
                            <Select defaultValue={mode ? purchases[0].id : selectedStock?.purchase.id} onChange={(value) => selectPurchase(value)}>
                                {purchases.map((purchase, index) => (
                                    <Option key={index + 1} value={purchase.id}>{purchase.id}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Unit"
                        >
                            {units.length > 0 &&
                            <Select defaultValue={mode ? units[0].id : selectedStock?.unit.id} onChange={(value) => selectUnit(value)}>
                                {units.map((unit, index) => (
                                    <Option key={index + 1} value={unit.id}>{unit.description}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>

                        <Form.Item
                            label="Types"
                            name="types"
                            initialValue={selectedStock?.types}
                            rules={[{ required: true, message: 'Types is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[{ required: true, message: 'Date is required' }]}
                            >
                                <DatePicker format={dateFormat} />
                            </Form.Item>
                        }

                        <Form.Item
                            label="Moved Quantity"
                            name="quantity_moved"
                            initialValue={selectedStock?.quantity_moved}
                            rules={[{ required: true, message: 'Moved quantity is required' }]}
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

export default StockList
import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ProductService from 'services/ProductService';
import CategoryService from 'services/CategoryService';
import UnitService from 'services/UnitService';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from 'store/slices/productSlice';
import { setCategory, setCategories } from 'store/slices/categorySlice';
import { setUnit, setUnits } from 'store/slices/unitSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const ProductList = () => {
    const { user } = useSelector(state => state.auth)
    
    const { category, categories } = useSelector(state => state.category)
    const { unit, units } = useSelector(state => state.unit)
    const { products } = useSelector(state => state.product)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedProduct, setselectedProduct] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setselectedProduct(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setselectedProduct(products.filter(product => product.id === id)[0])
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
                        const res = await ProductService.deleteProduct(id);
                        if (res) {
                            message.success({ content: 'Product deleted successfully', duration: 2.5 });
                            const filtered = products.filter((product) => product.id !== id);
                            dispatch(setProducts(filtered));
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

    const AddProduct = async (values) => {
        values.categoryId = category.id
        values.unitId = unit.id
        setIsLoading(true)
        const res = await ProductService.createProduct(values);
        if (res) {
            message.success({ content: "Product created successfully", duration: 2.5 });
            dispatch(setProducts([...products, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditProduct = async (values) => {
        values.categoryId = category.id
        values.unitId = unit.id
        setIsLoading(true)
        const res = await ProductService.updateProduct(selectedProduct.id, values);
        if (res) {
            message.success({ content: "Product updated successfully", duration: 2.5 });
            const updatedProducts = products.map((product) => {
                if (product.id === selectedProduct.id) return res;
                else return product
            })
            dispatch(setProducts(updatedProducts))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getProducts = async () => {
        dispatch(setProducts([]))
        const res = await ProductService.getAllProduct()
        if (res) {
            dispatch(setProducts(res))
        }
    }

    const getCategories = async () => {
        dispatch(setCategories([]))
        const res = await CategoryService.getAllCategory()
        if (res) {
            dispatch(setCategories(res))
        }
    }

    const getUnits = async () => {
        dispatch(setUnits([]))
        const res = await UnitService.getAllUnit()
        if (res) {
            dispatch(setUnits(res))
        }
    }

    const selectCategory = async (id) => {
        const res = await CategoryService.getCategoryById(id)
        if (res) {
            dispatch(setCategory(res))
        }
    }

    const selectUnit = async (id) => {
        const res = await UnitService.getUnitById(id)
        if (res) {
            dispatch(setUnit(res))
        }
    }

    useEffect(() => {
        if (user) {
            getProducts()
            getCategories()
            getUnits()
            dispatch(setCategory(categories[0]))
            dispatch(setUnit(units[0]))
        }
    }, [user])
    
    useEffect(() => {
        if (categories.length > 0) dispatch(setCategory(categories[0]));
    }, [categories])
    
    useEffect(() => {
        if (units.length > 0) dispatch(setUnit(units[0]));
    }, [units])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Product',
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
            title: 'Category',
            dataIndex: 'category',
            render: category => (
                <span>{category.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.category.description.toLowerCase();
                    b = b.category.description.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: type => (
                <span>{type}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.type.toLowerCase();
                    b = b.type.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            render: barcode => (
                <span>{barcode}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.barcode.toLowerCase();
                    b = b.barcode.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            render: stock => (
                <span>{stock}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.stock.toLowerCase();
                    b = b.stock.toLowerCase();
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
                    Add Product
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={products} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Product' : 'Edit Product'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddProduct : EditProduct}
                    >
                        <Form.Item
                            label="Category"
                        >
                            {categories.length > 0 &&
                            <Select defaultValue={mode ? categories[0].id : selectedProduct?.category.id} onChange={(value) => selectCategory(value)}>
                                {categories.map((category, index) => (
                                    <Option key={index + 1} value={category.id}>{category.description}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>
                        <Form.Item
                            label="Unit"
                        >
                            {units.length > 0 &&
                            <Select defaultValue={mode ? units[0].id : selectedProduct?.unit.id} onChange={(value) => selectUnit(value)}>
                                {units.map((unit, index) => (
                                    <Option key={index + 1} value={unit.id}>{unit.description}, {unit.type}</Option>
                                ))}
                            </Select>
                            }
                        </Form.Item>
                        <Form.Item
                            label="Product"
                            name="description"
                            rules={[{ required: true, message: 'Please input Product' }]}
                            initialValue={selectedProduct?.description}
                        >
                            <Input defaultValue={selectedProduct?.description} />
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input Type' }]}
                            initialValue={selectedProduct?.type}
                        >
                            <Input defaultValue={selectedProduct?.type} />
                        </Form.Item>
                        <Form.Item
                            label="Barcode"
                            name="barcode"
                            rules={[{ required: true, message: 'Please input Barcode' }]}
                            initialValue={selectedProduct?.barcode}
                        >
                            <Input defaultValue={selectedProduct?.barcode} />
                        </Form.Item>
                        <Form.Item
                            label="Stock"
                            name="stock"
                            rules={[{ required: true, message: 'Please input stock' }]}
                            initialValue={selectedProduct?.stock}
                        >
                            <Input defaultValue={selectedProduct?.stock} />
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

export default ProductList
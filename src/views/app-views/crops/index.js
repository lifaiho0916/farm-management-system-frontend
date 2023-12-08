import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select, DatePicker } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import ProductCropService from 'services/ProductCropService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setProductCrops } from 'store/slices/productCropSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const dateFormat = 'DD/MM/YYYY';

const ProductCropList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { productCrops } = useSelector(state => state.productCrop)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedProductCrop, setSelectedProductCrop] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    const getProductCrops = async (id) => {
        dispatch(setProductCrops([]))
        const res = await ProductCropService.getProductCropsByFarm(id)
        if (res) {
            dispatch(setProductCrops(res))
            setFarm(farms.filter((farm) => farm.id === id)[0])
            console.log(productCrops)
        }
    }

    const AddBtnClick = () => {
        setSelectedProductCrop(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedProductCrop(productCrops.filter(productCrop => productCrop.id === id)[0])
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
                        const res = await ProductCropService.deleteProductCrop(id);
                        if (res) {
                            message.success({ content: 'Product Crop deleted successfully', duration: 2.5 });
                            const filtered = productCrops.filter((productCrop) => productCrop.id !== id);
                            dispatch(setProductCrops(filtered));
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

    const AddProductCrop = async (values) => {
        setIsLoading(true)
        values.farmId = farm.id
        values.year = values.date.$y
        const res = await ProductCropService.createProductCrop(values);
        if (res) {
            message.success({ content: "Plot created successfully", duration: 2.5 });
            dispatch(setProductCrops([...productCrops, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditProductCrop = async (values) => {
        setIsLoading(true)
        const res = await ProductCropService.updateProductCrop(selectedProductCrop.id, values);
        if (res) {
            message.success({ content: "Product Crop updated successfully", duration: 2.5 });
            const updatedProductCrops = productCrops.map((productCrop) => {
                if (productCrop.id === selectedProductCrop.id) return res;
                else return productCrop
            })
            dispatch(setProductCrops(updatedProductCrops))
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
            getProductCrops(farms[0].id)
            dispatch(setFarm(farms[0]))
        }
    }, [farms])


    useEffect(() => {
        if(farm) {
            getProductCrops(farm.id);
        }
    }, [farm])

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
                <span>{crop.description}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.quantity.description.toLowerCase();
                    b = b.quantity.description.toLowerCase();
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
                    <Select onChange={(value) => { getProductCrops(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                    Add Product Crop
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={productCrops} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Product Crop' : 'Edit Product Crop'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddProductCrop : EditProductCrop}
                    >
                        <Form.Item
                            label="Crop"
                            name="cropDescription"
                            initialValue={selectedProductCrop?.crop.description}
                            rules={[{ required: true, message: 'Crop is required' }]}
                        >
                            <Input defaultValue={selectedProductCrop?.crop.description} placeholder="Coffe"/>
                        </Form.Item>

                        <Form.Item
                            label="Unit"
                            name="unitDescription"
                            initialValue={selectedProductCrop?.unit.description}
                            rules={[{ required: true, message: 'Unit is required' }]}
                        >
                            <Input defaultValue={selectedProductCrop?.unit.description}  placeholder="60kg"/>
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            initialValue={selectedProductCrop?.unit.type}
                            rules={[{ required: true, message: 'Type is required' }]}
                        >
                            <Input defaultValue={selectedProductCrop?.unit.type}  placeholder="Sack"/>
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            initialValue={selectedProductCrop?.quantity}
                            rules={[{ required: true, message: 'Quantity is required' }]}
                        >
                            <Input defaultValue={selectedProductCrop?.quantity}  placeholder="12"/>
                        </Form.Item>

                        {mode &&
                            <Form.Item
                                label="Product Date"
                                name="date"
                                rules={[{ required: true, message: 'Date is required' }]}
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

export default ProductCropList
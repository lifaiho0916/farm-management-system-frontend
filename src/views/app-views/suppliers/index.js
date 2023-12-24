import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import SupplierService from 'services/SupplierService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setSuppliers } from 'store/slices/supplierSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const SupplierList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { suppliers } = useSelector(state => state.supplier)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    const getSuppliers = async (id) => {
        dispatch(setSuppliers([]))
        const res = await SupplierService.getSuppliersByFarm(id)
        if (res) {
            dispatch(setSuppliers(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const AddBtnClick = () => {
        setSelectedSupplier(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedSupplier(suppliers.filter(supplier => supplier.id === id)[0])
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
                        const res = await SupplierService.deleteSupplier(id);
                        if (res) {
                            message.success({ content: 'Supplier deleted successfully', duration: 2.5 });
                            const filtered = suppliers.filter((supplier) => supplier.id !== id);
                            dispatch(setSuppliers(filtered));
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

    const AddSupplier = async (values) => {
        values.farmId = farm.id
        setIsLoading(true)
        const res = await SupplierService.createSupplier({ ...values, farmId: farm.id });
        if (res) {
            message.success({ content: "Supplier created successfully", duration: 2.5 });
            dispatch(setSuppliers([...suppliers, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditSupplier = async (values) => {
        values.farmId = farm.id
        setIsLoading(true)
        const res = await SupplierService.updateSupplier(selectedSupplier.id, values);
        if (res) {
            message.success({ content: "Supplier updated successfully", duration: 2.5 });
            const updatedSuppliers = suppliers.map((supplier) => {
                if (supplier.id === selectedSupplier.id) return res;
                else return supplier
            })
            dispatch(setSuppliers(updatedSuppliers))
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
            getSuppliers(farm.id);
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
            title: 'Name',
            dataIndex: 'name',
            render: name => (
                <span>{name}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.name.toLowerCase();
                    b = b.name.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Cnpj',
            dataIndex: 'cnpj',
            render: cnpj => (
                <span>{cnpj}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.cnpj.toLowerCase();
                    b = b.cnpj.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'City',
            dataIndex: 'city',
            render: city => (
                <span>{city}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.city.toLowerCase();
                    b = b.city.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'State',
            dataIndex: 'state',
            render: state => (
                <span>{state}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.state.toLowerCase();
                    b = b.state.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: phone => (
                <span>{phone}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.phone.toLowerCase();
                    b = b.phone.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: email => (
                <span>{email}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.email.toLowerCase();
                    b = b.email.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Street',
            dataIndex: 'street',
            render: street => (
                <span>{street}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.street.toLowerCase();
                    b = b.street.toLowerCase();
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
                    <Select onChange={(value) => { getSuppliers(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {farms.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add Supplier
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={suppliers} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Supplier' : 'Edit Supplier'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddSupplier : EditSupplier}
                    >

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your full name!' }, () => ({
                                validator(_, value) {
                                    if (value.length === 0 || value.length >= 4) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Minimum 4 characters');
                                },
                            })]}
                            initialValue={selectedSupplier?.name}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Cnpj"
                            name="cnpj"
                            initialValue={selectedSupplier?.cnpj}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                            initialValue={selectedSupplier?.city}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="State"
                            name="state"
                            initialValue={selectedSupplier?.state}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            initialValue={selectedSupplier?.phone}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            initialValue={selectedSupplier?.email}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Street"
                            name="street"
                            initialValue={selectedSupplier?.street}
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

export default SupplierList
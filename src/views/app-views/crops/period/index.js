import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import CropService from 'services/CropService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setCrops } from 'store/slices/cropSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const CropList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { crops } = useSelector(state => state.crop)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    const getCrops = async (id) => {
        dispatch(setCrops([]))
        const res = await CropService.getCropsByFarm(id)
        if (res) {
            dispatch(setCrops(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const AddBtnClick = () => {
        setSelectedCrop(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedCrop(crops.filter(crop => crop.id === id)[0])
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
                        const res = await CropService.deleteCrop(id);
                        if (res) {
                            message.success({ content: 'Crop deleted successfully', duration: 2.5 });
                            const filtered = crops.filter((crop) => crop.id !== id);
                            dispatch(setCrops(filtered));
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

    const AddCrop = async (values) => {
        setIsLoading(true)
        values.farmId = farm.id
        const res = await CropService.createCrop(values);
        if (res) {
            message.success({ content: "Plot created successfully", duration: 2.5 });
            dispatch(setCrops([...crops, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditCrop = async (values) => {
        values.farmId = farm.id
        setIsLoading(true)
        const res = await CropService.updateCrop(selectedCrop.id, values);
        if (res) {
            message.success({ content: "Crop updated successfully", duration: 2.5 });
            const updatedCrops = crops.map((crop) => {
                if (crop.id === selectedCrop.id) return res;
                else return crop
            })
            dispatch(setCrops(updatedCrops))
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
            getCrops(farms[0].id)
            dispatch(setFarm(farms[0]))
        }
    }, [farms])


    useEffect(() => {
        if(farm) {
            getCrops(farm.id);
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
            title: 'Year',
            dataIndex: 'year',
            render: year => (
                <span>{year}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.year.toLowerCase();
                    b = b.year.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            render: start_date => (
                <span>{start_date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.start_date.toLowerCase();
                    b = b.start_date.toLowerCase();
                    return a > b ? -1 : b > a ? 1 : 0;
                },
            },
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            render: end_date => (
                <span>{end_date}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.end_date.toLowerCase();
                    b = b.end_date.toLowerCase();
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
                    <Select onChange={(value) => { getCrops(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {farms.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add Crop
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={crops} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Product Crop' : 'Edit Product Crop'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddCrop : EditCrop}
                    >
                        <Form.Item
                            label="Crop"
                            name="description"
                            initialValue={selectedCrop?.description}
                            rules={[{ required: true, message: 'Crop is required' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Year"
                            name="year"
                            initialValue={selectedCrop?.year}
                            rules={[{ required: true, message: 'Year is required' }]}
                        >
                            <Input placeholder="2023"/>
                        </Form.Item>

                        <Form.Item
                            label="Start Month"
                            name="start_date"
                            initialValue={selectedCrop?.start_date}
                            rules={[{ required: true, message: 'Start month is required' }]}
                        >
                            <Input placeholder="03"/>
                        </Form.Item>

                        <Form.Item
                            label="End Month"
                            name="end_date"
                            initialValue={selectedCrop?.end_date}
                            rules={[{ required: true, message: 'End month is required' }]}
                        >
                            <Input placeholder="12"/>
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

export default CropList
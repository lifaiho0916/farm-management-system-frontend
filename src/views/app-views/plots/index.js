import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import PlotService from 'services/PlotService';
import { useSelector, useDispatch } from 'react-redux';
import { setFarm, setFarms } from 'store/slices/farmSlice';
import { setPlots } from 'store/slices/plotSlice';
import FarmService from 'services/FarmService';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const { Option } = Select;

const PlotList = () => {

    const { user } = useSelector(state => state.auth)
    const { farm, farms } = useSelector(state => state.farm)
    const { plots } = useSelector(state => state.plot)
    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedPlot, setSelectedPlot] = useState(null)

    const getFarms = async () => {
        dispatch(setFarms([]))
        const res = await FarmService.getFarmsByAdmin(user.id)
        if (res) {
            dispatch(setFarms(res))
        }
    }

    const getPlots = async (id) => {
        dispatch(setPlots([]))
        const res = await PlotService.getPlotsByFarm(id)
        if (res) {
            dispatch(setPlots(res))
            dispatch(setFarm(farms.filter((farm) => farm.id === id)[0]))
        }
    }

    const AddBtnClick = () => {
        setSelectedPlot(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedPlot(plots.filter(plot => plot.id === id)[0])
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
                        const res = await PlotService.deletePlot(id);
                        if (res) {
                            message.success({ content: 'Plot deleted successfully', duration: 2.5 });
                            const filtered = plots.filter((plot) => plot.id !== id);
                            dispatch(setPlots(filtered));
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

    const AddPlot = async (values) => {
        values.farmId = farm.id
        console.log(values)
        setIsLoading(true)
        const res = await PlotService.createPlot({ ...values, farmId: farm.id });
        if (res) {
            message.success({ content: "Plot created successfully", duration: 2.5 });
            dispatch(setPlots([...plots, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditPlot = async (values) => {
        setIsLoading(true)
        const res = await PlotService.updatePlot(selectedPlot.id, values);
        if (res) {
            message.success({ content: "Plot updated successfully", duration: 2.5 });
            const updatedPlots = plots.map((plot) => {
                if (plot.id === selectedPlot.id) return res;
                else return plot
            })
            dispatch(setPlots(updatedPlots))
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
            getPlots(farm.id);
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
            title: 'Description',
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
            title: 'Area',
            dataIndex: 'area',
            render: area => (
                <span>{area}</span>
            ),
            sorter: {
                compare: (a, b) => {
                    a = a.area.toLowerCase();
                    b = b.area.toLowerCase();
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
                    <Select onChange={(value) => { getPlots(value) }} defaultValue={farms[0].id}>
                        {farms.map((farm, index) => (
                            <Option key={index} value={farm.id}>{farm.description}</Option>
                        ))}
                    </Select>
                }
                {farms.length > 0 && 
                    <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                        Add Plot
                    </Button>
                }
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={plots} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Plot' : 'Edit Plot'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddPlot : EditPlot}
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
                            initialValue={selectedPlot?.name}
                        >
                            <Input defaultValue={selectedPlot?.name} />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            initialValue={selectedPlot?.description}
                        >
                            <Input defaultValue={selectedPlot?.description} />
                        </Form.Item>

                        <Form.Item
                            label="Area"
                            name="area"
                            initialValue={selectedPlot?.area}
                        >
                            <Input defaultValue={selectedPlot?.area} />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            initialValue={selectedPlot?.type}
                        >
                            <Input defaultValue={selectedPlot?.type} />
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

export default PlotList
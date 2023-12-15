import React, { useEffect, useState } from 'react'
import { Card, Table, Tooltip, Button, Modal, Input, Form, message, Select } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import UnitService from 'services/UnitService';
import { useSelector, useDispatch } from 'react-redux';
import { setUnits } from 'store/slices/unitSlice';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
};

const UnitList = () => {
    const { user } = useSelector(state => state.auth)
    const { units } = useSelector(state => state.unit)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState(null)

    const dispatch = useDispatch()

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const AddBtnClick = () => {
        setSelectedUnit(null)
        setIsModalOpen(true);
        setMode(true);
    };

    const EditBtnClick = (id) => {
        setSelectedUnit(units.filter(unit => unit.id === id)[0])
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
                        const res = await UnitService.deleteUnit(id);
                        if (res) {
                            message.success({ content: 'Unit deleted successfully', duration: 2.5 });
                            const filtered = units.filter((unit) => unit.id !== id);
                            dispatch(setUnits(filtered));
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

    const AddUnit = async (values) => {
        setIsLoading(true)
        const res = await UnitService.createUnit(values);
        if (res) {
            message.success({ content: "Unit created successfully", duration: 2.5 });
            dispatch(setUnits([...units, res]))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const EditUnit = async (values) => {
        setIsLoading(true)
        const res = await UnitService.updateUnit(selectedUnit.id, values);
        if (res) {
            message.success({ content: "Unit updated successfully", duration: 2.5 });
            const updatedUnits = units.map((unit) => {
                if (unit.id === selectedUnit.id) return res;
                else return unit
            })
            dispatch(setUnits(updatedUnits))
            setIsModalOpen(false);
        }
        setIsLoading(false)
    }

    const getUnits = async () => {
        dispatch(setUnits([]))
        const res = await UnitService.getAllUnit()
        if (res) {
            dispatch(setUnits(res))
        }
    }


    useEffect(() => {
        if (user) {
            getUnits()
        }
    }, [user])

    const tableColumns = [
        {
            title: 'No',
            render: (_, elm, index) => (
                <span>{index + 1}</span>
            )
        },
        {
            title: 'Unit',
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
                <Button type="primary" onClick={AddBtnClick} style={{ margin: 10 }}>
                    Add Unit
                </Button>
                <div className="table-responsive">
                    <Table columns={tableColumns} dataSource={units} rowKey='id' />
                </div>
            </Card>
            {isModalOpen &&
                <Modal title={mode ? 'Add Unit' : 'Edit Unit'} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <Form
                        {...layout}
                        style={{ marginTop: 20 }}
                        onFinish={mode ? AddUnit : EditUnit}
                    >
                        <Form.Item
                            label="Unit"
                            name="description"
                            rules={[{ required: true, message: 'Please input Unit' }]}
                            initialValue={selectedUnit?.description}
                        >
                            <Input defaultValue={selectedUnit?.description} />
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input Type' }]}
                            initialValue={selectedUnit?.type}
                        >
                            <Input defaultValue={selectedUnit?.type} />
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

export default UnitList